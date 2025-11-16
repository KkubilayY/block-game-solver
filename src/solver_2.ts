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
 * --- NEW: Metric utilities used for tie-breaking ---
 */

/** 4-neighbor BFS connected-component sizes; returns largest connected occupied component size */
function largestConnectedComponentSize(grid: GridCell[][]): number {
  const R = grid.length;
  const C = grid[0].length;
  const seen = Array.from({ length: R }, () => Array(C).fill(false));
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let best = 0;

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (!grid[r][c].occupied || seen[r][c]) continue;
      // BFS
      let size = 0;
      const q: [number, number][] = [[r, c]];
      seen[r][c] = true;
      while (q.length) {
        const [rr, cc] = q.shift()!;
        size++;
        for (const [dr, dc] of dirs) {
          const nr = rr + dr;
          const nc = cc + dc;
          if (nr >= 0 && nr < R && nc >= 0 && nc < C && !seen[nr][nc] && grid[nr][nc].occupied) {
            seen[nr][nc] = true;
            q.push([nr, nc]);
          }
        }
      }
      if (size > best) best = size;
    }
  }
  return best;
}

/** Checks whether there exists any 3x3 empty block in the grid */
function exists3x3Empty(grid: GridCell[][]): boolean {
  const R = grid.length;
  const C = grid[0].length;
  for (let r = 0; r <= R - 3; r++) {
    for (let c = 0; c <= C - 3; c++) {
      let ok = true;
      for (let rr = r; rr < r + 3 && ok; rr++) {
        for (let cc = c; cc < c + 3; cc++) {
          if (grid[rr][cc].occupied) {
            ok = false;
            break;
          }
        }
      }
      if (ok) return true;
    }
  }
  return false;
}

/**
 * Compute bounding box of occupied cells and return number of internal gaps:
 * boundingBoxArea - occupiedCount (cells inside bounding box that are empty).
 * If no occupied cells, we define internal gaps = large number (so solutions with no occupied cells will be sorted last).
 */
function internalGapsInBoundingBox(grid: GridCell[][]): number {
  const R = grid.length;
  const C = grid[0].length;
  let minR = R,
    minC = C,
    maxR = -1,
    maxC = -1;
  let occ = 0;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c].occupied) {
        occ++;
        if (r < minR) minR = r;
        if (c < minC) minC = c;
        if (r > maxR) maxR = r;
        if (c > maxC) maxC = c;
      }
    }
  }
  if (occ === 0) return Number.MAX_SAFE_INTEGER; // penalize empty final grids
  const height = maxR - minR + 1;
  const width = maxC - minC + 1;
  const area = height * width;
  return area - occ; // internal empty cells within bounding rectangle
}

/**
 * Corner concentration score: sum(distances squared) to nearest corner (lower is better).
 * Distances squared avoids needing sqrt and emphasizes clustering.
 */
function cornerConcentrationScore(grid: GridCell[][]): number {
  const R = grid.length;
  const C = grid[0].length;
  const corners = [
    [0, 0],
    [0, C - 1],
    [R - 1, 0],
    [R - 1, C - 1],
  ];
  let total = 0;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (!grid[r][c].occupied) continue;
      let best = Number.POSITIVE_INFINITY;
      for (const [cr, cc] of corners) {
        const dr = r - cr;
        const dc = c - cc;
        const d2 = dr * dr + dc * dc;
        if (d2 < best) best = d2;
      }
      total += best;
    }
  }
  return total;
}

/**
 * --- NEW: exhaustive search that returns ALL final solutions for a given order ---
 * Each result: { finalGrid, placements } representing one possible sequence of placing/skipping items in this order.
 */
function searchAllForOrder(
  currentGrid: GridCell[][],
  itemsInOrder: Item[],
  orderIndex: number
): { finalGrid: GridCell[][]; placements: Placement[] }[] {
  if (orderIndex >= itemsInOrder.length) {
    return [{ finalGrid: cloneGrid(currentGrid), placements: [] }];
  }

  const item = itemsInOrder[orderIndex];
  const anchorLocal = findLocalAnchor(item.cells);
  const NROWS = currentGrid.length;
  const NCOLS = currentGrid[0].length;

  const results: { finalGrid: GridCell[][]; placements: Placement[] }[] = [];

  // Try every possible anchor grid cell
  for (let r = 0; r < NROWS; r++) {
    for (let c = 0; c < NCOLS; c++) {
      const attempt = tryPlacementAt(currentGrid, item, anchorLocal, r, c);
      if (!attempt) continue;

      const placedCellsSimple = attempt.placedCells.map((p) => ({ gridRow: p.gridRow, gridCol: p.gridCol }));
      const nextGrid = applyPlacementAndBlast(currentGrid, placedCellsSimple);

      // recurse to get all continuations
      const recs = searchAllForOrder(nextGrid, itemsInOrder, orderIndex + 1);
      for (const rec of recs) {
        const thisPlacement: Placement = {
          itemId: item.id,
          placed: true,
          anchorGridRow: r,
          anchorGridCol: c,
          placedCells: attempt.placedCells.map((p) => ({ gridRow: p.gridRow, gridCol: p.gridCol, localRow: p.localRow, localCol: p.localCol })),
        };
        results.push({ finalGrid: rec.finalGrid, placements: [thisPlacement, ...rec.placements] });
      }
    }
  }

  // Option: skip placing this item
  {
    const recs = searchAllForOrder(currentGrid, itemsInOrder, orderIndex + 1);
    for (const rec of recs) {
      const thisPlacement: Placement = { itemId: item.id, placed: false };
      results.push({ finalGrid: rec.finalGrid, placements: [thisPlacement, ...rec.placements] });
    }
  }

  return results;
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
  if (a.length === 0) return [[]];
  permute(a.length);
  return results;
}

/**
 * Main exported function:
 * - slots: Item[] (length up to 3 expected)
 * - grid: GridCell[][] current grid state (8x8)
 *
 * Returns a SolutionResult chosen by the tie-breaking rules described above.
 */
export function computeBestSolution(slots: Item[], grid: GridCell[][]): SolutionResult {
  const initialGrid = cloneGrid(grid);
  const initialOccupiedCount = countOccupied(initialGrid);

  const perms = permutations(slots);

  type Candidate = { finalGrid: GridCell[][]; placements: Placement[]; delta: number };

  const allCandidates: Candidate[] = [];

  for (const order of perms) {
    const results = searchAllForOrder(cloneGrid(initialGrid), order, 0);
    for (const res of results) {
      const finalCount = countOccupied(res.finalGrid);
      const delta = finalCount - initialOccupiedCount;
      allCandidates.push({ finalGrid: res.finalGrid, placements: res.placements, delta });
    }
  }

  if (allCandidates.length === 0) {
    // no placements possible (shouldn't happen because we always allow skipping), but handle defensively
    return {
      placements: [],
      initialOccupiedCount,
      finalOccupiedCount: initialOccupiedCount,
      delta: 0,
    };
  }

  // 1) Keep solutions with smallest delta
  let minDelta = Math.min(...allCandidates.map((c) => c.delta));
  let best = allCandidates.filter((c) => c.delta === minDelta);

  // 2) Among them, keep those with maximum contiguous occupied cells
  let maxConn = Math.max(...best.map((c) => largestConnectedComponentSize(c.finalGrid)));
  best = best.filter((c) => largestConnectedComponentSize(c.finalGrid) === maxConn);

  // 3) Among them, prefer those that *have* a 3x3 empty block.
  const anyWith3x3 = best.some((c) => exists3x3Empty(c.finalGrid));
  if (anyWith3x3) {
    best = best.filter((c) => exists3x3Empty(c.finalGrid));
  }

  // 4) Among them, pick minimal internal gaps (compactness)
  let minInternalGaps = Math.min(...best.map((c) => internalGapsInBoundingBox(c.finalGrid)));
  best = best.filter((c) => internalGapsInBoundingBox(c.finalGrid) === minInternalGaps);

  // 5) Among them, pick minimal corner concentration score (clustered to a corner)
  let minCornerScore = Math.min(...best.map((c) => cornerConcentrationScore(c.finalGrid)));
  best = best.filter((c) => cornerConcentrationScore(c.finalGrid) === minCornerScore);

  // If multiple remain, pick the first deterministically
  const chosen = best[0];

  // Print placements in console in human friendly manner
  console.log("=== Solver result ===");
  console.log("Initial occupied:", initialOccupiedCount);
  console.log("Best delta:", chosen.delta);
  console.log("Placement order (first => last):");
  chosen.placements.forEach((p, idx) => {
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
    placements: chosen.placements,
    initialOccupiedCount,
    finalOccupiedCount: countOccupied(chosen.finalGrid),
    delta: chosen.delta,
  };
}
