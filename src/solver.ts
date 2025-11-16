// src/solver.ts
import { GridCell, Item, LocalCell } from "./types";

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
  placements: Placement[];
  initialOccupiedCount: number;
  finalOccupiedCount: number;
  delta: number;
  stepGrids: GridCell[][][];
}

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

/**
 * Iterative search using explicit stack to avoid call stack overflow
 */
function searchAllForOrderIterative(
  initialGrid: GridCell[][],
  itemsInOrder: Item[],
  maxCandidates: number = 10000
): { finalGrid: GridCell[][]; placements: Placement[]; stepGrids: GridCell[][][] }[] {
  const NROWS = initialGrid.length;
  const NCOLS = initialGrid[0].length;
  
  type StackFrame = {
    grid: GridCell[][];
    orderIndex: number;
    row: number;
    col: number;
    placements: Placement[];
    stepGrids: GridCell[][][];
  };
  
  const stack: StackFrame[] = [{
    grid: initialGrid,
    orderIndex: 0,
    row: 0,
    col: 0,
    placements: [],
    stepGrids: []
  }];
  
  const results: { finalGrid: GridCell[][]; placements: Placement[]; stepGrids: GridCell[][][] }[] = [];
  let iterations = 0;
  const maxIterations = 500000; // Prevent infinite loops
  
  while (stack.length > 0 && results.length < maxCandidates && iterations < maxIterations) {
    iterations++;
    const frame = stack.pop()!;
    
    // If we've placed all items, save this solution
    if (frame.orderIndex >= itemsInOrder.length) {
      results.push({
        finalGrid: frame.grid,
        placements: frame.placements,
        stepGrids: frame.stepGrids
      });
      continue;
    }
    
    const item = itemsInOrder[frame.orderIndex];
    const anchorLocal = findLocalAnchor(item.cells);
    
    // Continue from where we left off in this frame
    for (let r = frame.row; r < NROWS; r++) {
      const startCol = (r === frame.row) ? frame.col : 0;
      for (let c = startCol; c < NCOLS; c++) {
        const attempt = tryPlacementAt(frame.grid, item, anchorLocal, r, c);
        if (!attempt) continue;
        
        const placedCellsSimple = attempt.placedCells.map((p) => ({
          gridRow: p.gridRow,
          gridCol: p.gridCol,
        }));
        const nextGrid = applyPlacementAndBlast(frame.grid, placedCellsSimple, item.color);
        
        const thisPlacement: Placement = {
          itemId: item.id,
          placed: true,
          anchorGridRow: r,
          anchorGridCol: c,
          placedCells: attempt.placedCells,
        };
        
        // Push new frame for next item
        stack.push({
          grid: nextGrid,
          orderIndex: frame.orderIndex + 1,
          row: 0,
          col: 0,
          placements: [...frame.placements, thisPlacement],
          stepGrids: [...frame.stepGrids, nextGrid]
        });
      }
    }
  }
  
  if (iterations >= maxIterations) {
    console.warn(`Search stopped after ${maxIterations} iterations`);
  }
  if (results.length >= maxCandidates) {
    console.warn(`Search stopped after finding ${maxCandidates} candidates`);
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

export function computeBestSolution(
  slots: Item[],
  grid: GridCell[][]
): SolutionResult {
  const initialGrid = cloneGrid(grid);
  const initialOccupiedCount = countOccupied(initialGrid);

  const perms = permutations(slots);

  type Candidate = {
    finalGrid: GridCell[][];
    placements: Placement[];
    stepGrids: GridCell[][][];
    delta: number;
  };

  let allCandidates: Candidate[] = [];
  const maxCandidatesPerPermutation = 5000;
  const maxTotalCandidates = 20000;

  for (const order of perms) {
    // Stop if we've already collected enough candidates
    if (allCandidates.length >= maxTotalCandidates) {
      console.log(`Stopping early: already have ${allCandidates.length} candidates`);
      break;
    }
    
    const results = searchAllForOrderIterative(
      cloneGrid(initialGrid), 
      order, 
      maxCandidatesPerPermutation
    );
    
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
      
      // Stop if we've collected enough total candidates
      if (allCandidates.length >= maxTotalCandidates) {
        break;
      }
    }
  }

  if (allCandidates.length === 0) {
    console.warn("computeBestSolution: no complete placement found.");
    return {
      placements: [],
      initialOccupiedCount,
      finalOccupiedCount: initialOccupiedCount,
      delta: Number.POSITIVE_INFINITY,
      stepGrids: [],
    };
  }

  console.log(`Found ${allCandidates.length} total candidates, now filtering...`);

  // Filter to best delta first (most important criterion)
  let minDelta = Math.min(...allCandidates.map((c) => c.delta));
  let best = allCandidates.filter((c) => c.delta === minDelta);
  console.log(`After delta filter: ${best.length} candidates with delta=${minDelta}`);

  // Then apply tie-breakers
  let maxConn = Math.max(...best.map((c) => largestConnectedComponentSize(c.finalGrid)));
  best = best.filter((c) => largestConnectedComponentSize(c.finalGrid) === maxConn);
  console.log(`After connectivity filter: ${best.length} candidates`);

  const anyWith3x3 = best.some((c) => exists3x3Empty(c.finalGrid));
  if (anyWith3x3) {
    best = best.filter((c) => exists3x3Empty(c.finalGrid));
    console.log(`After 3x3 empty filter: ${best.length} candidates`);
  }

  let minInternalGaps = Math.min(...best.map((c) => internalGapsInBoundingBox(c.finalGrid)));
  best = best.filter((c) => internalGapsInBoundingBox(c.finalGrid) === minInternalGaps);
  console.log(`After internal gaps filter: ${best.length} candidates`);

  let minCornerScore = Math.min(...best.map((c) => cornerConcentrationScore(c.finalGrid)));
  best = best.filter((c) => cornerConcentrationScore(c.finalGrid) === minCornerScore);
  console.log(`After corner concentration filter: ${best.length} candidates`);

  const chosen = best[0];

  console.log("=== Solver result ===");
  console.log("Initial occupied:", initialOccupiedCount);
  console.log("Total candidates evaluated:", allCandidates.length);
  console.log("Best delta (final-only):", chosen.delta);
  console.log("Placement order (first => last):");
  chosen.placements.forEach((p, idx) => {
    if (p.placed) {
      console.log(
        `${idx + 1}. ${p.itemId} -> anchor at (${p.anchorGridRow}, ${p.anchorGridCol})`
      );
    }
  });
  console.log("=====================");

  return {
    placements: chosen.placements,
    initialOccupiedCount,
    finalOccupiedCount: countOccupied(chosen.finalGrid),
    delta: chosen.delta,
    stepGrids: chosen.stepGrids,
  };
}