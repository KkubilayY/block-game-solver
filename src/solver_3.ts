// src/solver.ts
import { GridCell, Item, LocalCell } from "./types";
let searchCallCount = 0;
const MAX_SEARCH_CALLS = 100000;

/**
 * Types returned by solver
 */
export interface Placement {
  itemId: string;
  placed: boolean;
  anchorGridRow?: number;
  anchorGridCol?: number;
  placedCells?: {
    gridRow: number;
    gridCol: number;
    localRow: number;
    localCol: number;
  }[];
}

export interface SolutionResult {
  placements: Placement[]; // in the order chosen by solver (length == slots.length)
  initialOccupiedCount: number;
  finalOccupiedCount: number;
  delta: number; // final - initial (Number.POSITIVE_INFINITY if impossible)
  stepGrids: GridCell[][][]; 
}

/**
 * Deep clone grid
 */
export function cloneGrid(grid: GridCell[][]): GridCell[][] {
  return grid.map((r) => r.map((c) => ({ ...c })));
}

function countOccupied(grid: GridCell[][]): number {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c].occupied) count++;
    }
  }
  return count;
}

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

function tryPlacementAt(
  grid: GridCell[][],
  item: Item,
  anchorLocal: LocalCell,
  anchorGridRow: number,
  anchorGridCol: number
): {
  placedCells: {
    gridRow: number;
    gridCol: number;
    localRow: number;
    localCol: number;
  }[];
} | null {
  const placed: {
    gridRow: number;
    gridCol: number;
    localRow: number;
    localCol: number;
  }[] = [];
  const NROWS = grid.length;
  const NCOLS = grid[0].length;

  for (const lc of item.cells) {
    const gridRow = anchorGridRow - anchorLocal.localRowIndex + lc.localRowIndex;
    const gridCol = anchorGridCol - anchorLocal.localColIndex + lc.localColIndex;

    if (gridRow < 0 || gridRow >= NROWS || gridCol < 0 || gridCol >= NCOLS)
      return null;

    if (grid[gridRow][gridCol].occupied) return null;

    placed.push({
      gridRow,
      gridCol,
      localRow: lc.localRowIndex,
      localCol: lc.localColIndex,
    });
  }

  return { placedCells: placed };
}

function applyPlacementAndBlast(
  grid: GridCell[][],
  placedCells: { gridRow: number; gridCol: number }[],
  itemColor: string
) {
  const newGrid = cloneGrid(grid);

  for (const p of placedCells) {
    newGrid[p.gridRow][p.gridCol].occupied = true;
    newGrid[p.gridRow][p.gridCol].color = itemColor;
  }

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

  for (const r of Array.from(rowsToClear)) {
    for (let c = 0; c < newGrid[r].length; c++) {
      newGrid[r][c].occupied = false;
      newGrid[r][c].color = undefined;
    }
  }
  for (const c of Array.from(colsToClear)) {
    for (let r = 0; r < newGrid.length; r++) {
      newGrid[r][c].occupied = false;
      newGrid[r][c].color = undefined;
    }
  }

  return newGrid;
}

function largestConnectedComponentSize(grid: GridCell[][]): number {
  const R = grid.length;
  const C = grid[0].length;
  const seen = Array.from({ length: R }, () => Array(C).fill(false));
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let best = 0;

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (!grid[r][c].occupied || seen[r][c]) continue;
      let size = 0;
      const q: [number, number][] = [[r, c]];
      seen[r][c] = true;
      while (q.length) {
        const [rr, cc] = q.shift()!;
        size++;
        for (const [dr, dc] of dirs) {
          const nr = rr + dr;
          const nc = cc + dc;
          if (
            nr >= 0 &&
            nr < R &&
            nc >= 0 &&
            nc < C &&
            !seen[nr][nc] &&
            grid[nr][nc].occupied
          ) {
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

function internalGapsInBoundingBox(grid: GridCell[][]): number {
  const R = grid.length;
  const C = grid[0].length;
  let minR = R, minC = C, maxR = -1, maxC = -1;
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
  if (occ === 0) return Number.MAX_SAFE_INTEGER;
  const height = maxR - minR + 1;
  const width = maxC - minC + 1;
  const area = height * width;
  return area - occ;
}

function cornerConcentrationScore(grid: GridCell[][]): number {
  const R = grid.length;
  const C = grid[0].length;
  const corners = [[0, 0], [0, C - 1], [R - 1, 0], [R - 1, C - 1]];
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

function searchAllForOrder(
  currentGrid: GridCell[][],
  itemsInOrder: Item[],
  orderIndex: number
): { finalGrid: GridCell[][]; placements: Placement[]; stepGrids: GridCell[][][] }[] {
  // Check if we've exceeded the search limit
  searchCallCount++;
  if (searchCallCount > MAX_SEARCH_CALLS) {
    return [];
  }

  if (orderIndex >= itemsInOrder.length) {
    return [{ finalGrid: cloneGrid(currentGrid), placements: [], stepGrids: [] }];
  }

  const item = itemsInOrder[orderIndex];
  const anchorLocal = findLocalAnchor(item.cells);
  const NROWS = currentGrid.length;
  const NCOLS = currentGrid[0].length;

  const results: { finalGrid: GridCell[][]; placements: Placement[]; stepGrids: GridCell[][][] }[] = [];

  // Try every possible anchor grid cell
  for (let r = 0; r < NROWS; r++) {
    for (let c = 0; c < NCOLS; c++) {
      const attempt = tryPlacementAt(currentGrid, item, anchorLocal, r, c);
      if (!attempt) continue;

      const placedCellsSimple = attempt.placedCells.map((p) => ({
        gridRow: p.gridRow,
        gridCol: p.gridCol,
      }));
      const nextGrid = applyPlacementAndBlast(currentGrid, placedCellsSimple, item.color);

      // recurse to get all continuations
      const recs = searchAllForOrder(nextGrid, itemsInOrder, orderIndex + 1);
      for (const rec of recs) {
        const thisPlacement: Placement = {
          itemId: item.id,
          placed: true,
          anchorGridRow: r,
          anchorGridCol: c,
          placedCells: attempt.placedCells.map((p) => ({
            gridRow: p.gridRow,
            gridCol: p.gridCol,
            localRow: p.localRow,
            localCol: p.localCol,
          })),
        };
        results.push({
          finalGrid: rec.finalGrid,
          placements: [thisPlacement, ...rec.placements],
          stepGrids: [nextGrid, ...rec.stepGrids],
        });
      }
      
      // Early exit if we found enough solutions
      if (results.length > 100) {
        return results;
      }
    }
  }

  return results;
}

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

export function computeBestSolution(slots: Item[], grid: GridCell[][]): SolutionResult {
  searchCallCount = 0; // Reset counter
  const initialGrid = cloneGrid(grid);
  const initialOccupiedCount = countOccupied(initialGrid);

  const perms = permutations(slots);

  type Candidate = {
    finalGrid: GridCell[][];
    placements: Placement[];
    stepGrids: GridCell[][][];
    delta: number;
  };

  const allCandidates: Candidate[] = [];

  for (const order of perms) {
    const results = searchAllForOrder(cloneGrid(initialGrid), order, 0);
    for (const res of results) {
      if (res.placements.length !== slots.length) continue;
      if (!res.placements.every((p) => p.placed)) continue;

      const finalCount = countOccupied(res.finalGrid);
      const delta = finalCount - initialOccupiedCount;
      allCandidates.push({
        finalGrid: res.finalGrid,
        placements: res.placements,
        stepGrids: res.stepGrids,
        delta,
      });
    }
  }

  if (allCandidates.length === 0) {
    return {
      placements: [],
      initialOccupiedCount,
      finalOccupiedCount: initialOccupiedCount,
      delta: Number.POSITIVE_INFINITY,
      stepGrids: [],
    };
  }

  let minDelta = Math.min(...allCandidates.map((c) => c.delta));
  let best = allCandidates.filter((c) => c.delta === minDelta);

  let maxConn = Math.max(...best.map((c) => largestConnectedComponentSize(c.finalGrid)));
  best = best.filter((c) => largestConnectedComponentSize(c.finalGrid) === maxConn);

  const anyWith3x3 = best.some((c) => exists3x3Empty(c.finalGrid));
  if (anyWith3x3) {
    best = best.filter((c) => exists3x3Empty(c.finalGrid));
  }

  let minInternalGaps = Math.min(...best.map((c) => internalGapsInBoundingBox(c.finalGrid)));
  best = best.filter((c) => internalGapsInBoundingBox(c.finalGrid) === minInternalGaps);

  let minCornerScore = Math.min(...best.map((c) => cornerConcentrationScore(c.finalGrid)));
  best = best.filter((c) => cornerConcentrationScore(c.finalGrid) === minCornerScore);

  const chosen = best[0];

  return {
    placements: chosen.placements,
    initialOccupiedCount,
    finalOccupiedCount: countOccupied(chosen.finalGrid),
    delta: chosen.delta,
    stepGrids: chosen.stepGrids,
  };
}
