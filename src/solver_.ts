// src/solver.ts
import { GridCell, Item, LocalCell } from "./types";

/**
 * Types returned by solver
 */
export interface Placement {
  itemId: string;
  placed: boolean;
  anchorGridRow?: number;
  anchorGridCol?: number;
  placedCells?: { gridRow: number; gridCol: number; localRow: number; localCol: number }[];
}

export interface SolutionResult {
  placements: Placement[]; // in the order chosen by solver (length == slots.length)
  initialOccupiedCount: number;
  finalOccupiedCount: number;
  delta: number; // final - initial
}

/**
 * Deep clone grid
 */
function cloneGrid(grid: GridCell[][]): GridCell[][] {
  return grid.map((r) => r.map((c) => ({ ...c })));
}

/**
 * Count occupied cells in grid
 */
function countOccupied(grid: GridCell[][]): number {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c].occupied) count++;
    }
  }
  return count;
}

/**
 * Find local anchor cell based on smallest localRowIndex + localColIndex.
 * If multiple, returns the first encountered.
 */
function findLocalAnchor(cells: LocalCell[]): LocalCell {
  let best = cells[0];
  let bestSum = best.localRowIndex + best.localColIndex;
  for (const cell of cells) {
    const sum = cell.localRowIndex + cell.localColIndex;
    if (sum < bestSum) {
      best = cell;
      bestSum = sum;
    }
  }
  return best;
}

/**
 * Checks if placing item anchored by anchorLocal at anchorGridPos is valid (inside bounds and not overlapping occupied)
 * If valid, returns a list of placed cell coordinates; else returns null.
 */
function tryPlacementAt(
  grid: GridCell[][],
  item: Item,
  anchorLocal: LocalCell,
  anchorGridRow: number,
  anchorGridCol: number
): { placedCells: { gridRow: number; gridCol: number; localRow: number; localCol: number }[] } | null {
  const placed: { gridRow: number; gridCol: number; localRow: number; localCol: number }[] = [];
  const NROWS = grid.length;
  const NCOLS = grid[0].length;

  for (const lc of item.cells) {
    const gridRow = anchorGridRow - anchorLocal.localRowIndex + lc.localRowIndex;
    const gridCol = anchorGridCol - anchorLocal.localColIndex + lc.localColIndex;

    // bounds
    if (gridRow < 0 || gridRow >= NROWS || gridCol < 0 || gridCol >= NCOLS) return null;

    // overlapping
    if (grid[gridRow][gridCol].occupied) return null;

    placed.push({ gridRow, gridCol, localRow: lc.localRowIndex, localCol: lc.localColIndex });
  }

  return { placedCells: placed };
}

/**
 * Apply placed cells to a copy of grid, then run blasts (clear full rows/columns).
 * Returns the new grid after blasts.
 */
function applyPlacementAndBlast(grid: GridCell[][], placedCells: { gridRow: number; gridCol: number }[]) {
  const newGrid = cloneGrid(grid);

  // mark placed cells as occupied
  for (const p of placedCells) {
    newGrid[p.gridRow][p.gridCol].occupied = true;
  }

  // check full rows
  const rowsToClear = new Set<number>();
  for (let r = 0; r < newGrid.length; r++) {
    let full = true;
    for (let c = 0; c < newGrid[r].length; c++) {
      if (!newGrid[r][c].occupied) {
        full = false;
        break;
      }
    }
    if (full) rowsToClear.add(r);
  }

  // check full columns
  const colsToClear = new Set<number>();
  for (let c = 0; c < newGrid[0].length; c++) {
    let full = true;
    for (let r = 0; r < newGrid.length; r++) {
      if (!newGrid[r][c].occupied) {
        full = false;
        break;
      }
    }
    if (full) colsToClear.add(c);
  }

  // clear marked rows and cols
  for (const r of Array.from(rowsToClear)) {
    for (let c = 0; c < newGrid[r].length; c++) newGrid[r][c].occupied = false;
  }
  for (const c of Array.from(colsToClear)) {
    for (let r = 0; r < newGrid.length; r++) newGrid[r][c].occupied = false;
  }

  return newGrid;
}

/**
 * Recursively explore placement sequences for remaining items.
 * We pass currentGrid and remainingItems array.
 * We return best result (min delta) for this branch along with placements list.
 */
function searchBestForOrder(
  initialGrid: GridCell[][],
  currentGrid: GridCell[][],
  itemsInOrder: Item[],
  orderIndex: number,
  initialOccupiedCount: number
): { finalGrid: GridCell[][]; placements: Placement[] } {
  // base
  if (orderIndex >= itemsInOrder.length) {
    return { finalGrid: cloneGrid(currentGrid), placements: [] };
  }

  const item = itemsInOrder[orderIndex];

  const anchorLocal = findLocalAnchor(item.cells);
  const NROWS = currentGrid.length;
  const NCOLS = currentGrid[0].length;

  let bestFinalGrid: GridCell[][] | null = null;
  let bestPlacementsForThisItem: Placement[] | null = null;
  let bestDelta = Infinity;

  // Try every possible anchor grid cell
  for (let r = 0; r < NROWS; r++) {
    for (let c = 0; c < NCOLS; c++) {
      const attempt = tryPlacementAt(currentGrid, item, anchorLocal, r, c);
      if (!attempt) continue;

      // apply placement and blast
      const placedCellsSimple = attempt.placedCells.map((p) => ({ gridRow: p.gridRow, gridCol: p.gridCol }));
      const nextGrid = applyPlacementAndBlast(currentGrid, placedCellsSimple);

      // recurse for next items
      const rec = searchBestForOrder(initialGrid, nextGrid, itemsInOrder, orderIndex + 1, initialOccupiedCount);

      // compute delta based on final result (count occupied)
      const finalCount = countOccupied(rec.finalGrid);
      const delta = finalCount - initialOccupiedCount;

      if (delta < bestDelta) {
        bestDelta = delta;
        bestFinalGrid = rec.finalGrid;
        // record placement for this item + attachments of subsequent placements
        const thisPlacement: Placement = {
          itemId: item.id,
          placed: true,
          anchorGridRow: r,
          anchorGridCol: c,
          placedCells: attempt.placedCells.map((p) => ({ gridRow: p.gridRow, gridCol: p.gridCol, localRow: p.localRow, localCol: p.localCol })),
        };
        bestPlacementsForThisItem = [thisPlacement, ...rec.placements];
      }
    }
  }

  // Also consider NOT placing this item at all (skip it)
  {
    // simply continue recursion without changing currentGrid
    const rec = searchBestForOrder(initialGrid, currentGrid, itemsInOrder, orderIndex + 1, initialOccupiedCount);
    const finalCount = countOccupied(rec.finalGrid);
    const delta = finalCount - initialOccupiedCount;
    if (delta < bestDelta) {
      bestDelta = delta;
      bestFinalGrid = rec.finalGrid;
      const thisPlacement: Placement = {
        itemId: item.id,
        placed: false,
      };
      bestPlacementsForThisItem = [thisPlacement, ...rec.placements];
    }
  }

  return { finalGrid: bestFinalGrid ?? cloneGrid(currentGrid), placements: bestPlacementsForThisItem ?? [] };
}

/**
 * Utility to generate all permutations of an array (we need orderings of slots)
 */
function permutations<T>(arr: T[]): T[][] {
  const results: T[][] = [];
  const a = arr.slice();

  function permute(n: number) {
    if (n === 1) {
      results.push(a.slice());
      return;
    }
    for (let i = 0; i < n; i++) {
      permute(n - 1);
      const j = n % 2 ? 0 : i;
      [a[j], a[n - 1]] = [a[n - 1], a[j]];
    }
  }
  permute(a.length);
  return results;
}

/**
 * Main exported function:
 * - slots: Item[] (length up to 3 expected)
 * - grid: GridCell[][] current grid state (8x8)
 *
 * Console-prints the best placement order and anchor positions, and returns a SolutionResult.
 */
export function computeBestSolution(slots: Item[], grid: GridCell[][]): SolutionResult {
  const initialGrid = cloneGrid(grid);
  const initialOccupiedCount = countOccupied(initialGrid);

  // If there are duplicates in slots, permutations will still include duplicates; it's okay for exhaustive search.
  const perms = permutations(slots);

  let globalBestDelta = Infinity;
  let globalBestPlacements: Placement[] = [];
  let globalBestFinalGrid: GridCell[][] = cloneGrid(grid);

  // TODO: keep the best placements in terms of best delta, among them choose the one with the most continiguous occupied cells
  for (const order of perms) {
    // For each permutation, we recursively search placements following that order.
    const { finalGrid, placements } = searchBestForOrder(initialGrid, cloneGrid(initialGrid), order, 0, initialOccupiedCount);

    const finalCount = countOccupied(finalGrid);
    const delta = finalCount - initialOccupiedCount;

    if (delta < globalBestDelta) {
      globalBestDelta = delta;
      globalBestPlacements = placements;
      globalBestFinalGrid = finalGrid;
    }
  }

  // Print placements in console in human friendly manner
  console.log("=== Solver result ===");
  console.log("Initial occupied:", initialOccupiedCount);
  console.log("Best delta:", globalBestDelta);
  console.log("Placement order (first => last):");
  globalBestPlacements.forEach((p, idx) => {
    if (p.placed) {
      console.log(
        `${idx + 1}. ${p.itemId} -> anchor at (${p.anchorGridRow}, ${p.anchorGridCol}), placed cells: ${p.placedCells
          ?.map((pc) => `(${pc.gridRow},${pc.gridCol})`)
          .join(", ")}`
      );
    } else {
      console.log(`${idx + 1}. ${p.itemId} -> NOT PLACED`);
    }
  });
  console.log("=====================");

  return {
    placements: globalBestPlacements,
    initialOccupiedCount,
    finalOccupiedCount: countOccupied(globalBestFinalGrid),
    delta: globalBestDelta,
  };
}
