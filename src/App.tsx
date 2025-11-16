import React, { useState } from "react";
import Grid from "./Grid";
import ItemSelector from "./ItemSelector";
import ItemSlots from "./ItemSlots";
import { AVAILABLE_ITEMS } from "./items";
import { Item, GridCell } from "./types";
import { computeBestSolution, SolutionResult, cloneGrid } from "./solver";

function App() {
  const initialGrid: GridCell[][] = Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => ({
      rowIndex: row,
      colIndex: col,
      occupied: false,
    }))
  );

  const [grid, setGrid] = useState<GridCell[][]>(initialGrid);
  const [slots, setSlots] = useState<Item[]>([]);
  const [solution, setSolution] = useState<SolutionResult | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isGridLocked, setIsGridLocked] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const handleSelectItem = (item: Item) => {
    if (slots.length < 3 && !isGridLocked) setSlots([...slots, item]);
  };

  const handleRemoveSlot = (index: number) => {
    if (!isGridLocked) setSlots(slots.filter((_, idx) => idx !== index));
  };

  const handleSolve = () => {
    if (currentStep === -1) {
      // First click - compute solution
      const result = computeBestSolution(slots, grid);

      if (result.delta === Number.POSITIVE_INFINITY) {
        setShowGameOver(true);
        return;
      }

      setSolution(result);
      setIsGridLocked(true);

      // Show first item preview
      const firstPlacement = result.placements[0];
      if (firstPlacement && firstPlacement.placedCells) {
        const previewGrid = cloneGrid(grid);
        for (const pc of firstPlacement.placedCells) {
          previewGrid[pc.gridRow][pc.gridCol].occupied = true;
          previewGrid[pc.gridRow][pc.gridCol].isPreview = true;
          previewGrid[pc.gridRow][pc.gridCol].color = "#4caf50";
        }
        setGrid(previewGrid);
      }
      setCurrentStep(0);
    } else if (currentStep < 3) {
      // Show the result of placing current item
      if (solution && solution.stepGrids[currentStep]) {
        setGrid(cloneGrid(solution.stepGrids[currentStep]));
      }

      // If not last step, show next item preview
      if (currentStep < 2 && solution) {
        const nextPlacement = solution.placements[currentStep + 1];
        const nextCells = nextPlacement?.placedCells;
        if (nextPlacement && nextCells) {
          setTimeout(() => {
            const previewGrid = cloneGrid(solution.stepGrids[currentStep]);
            for (const pc of nextCells) {
              previewGrid[pc.gridRow][pc.gridCol].occupied = true;
              previewGrid[pc.gridRow][pc.gridCol].isPreview = true;
              previewGrid[pc.gridRow][pc.gridCol].color = "#4caf50";
            }
            setGrid(previewGrid);
          }, 500);
        }
      }

      setCurrentStep(currentStep + 1);
    }

    // After third item is placed, reset for next round
    if (currentStep === 2) {
      setTimeout(() => {
        setSlots([]);
        setSolution(null);
        setCurrentStep(-1);
        setIsGridLocked(false);
      }, 1000);
    }
  };

  const handleGameOverRefresh = () => {
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
      <Grid grid={grid} setGrid={setGrid} isLocked={isGridLocked} />

      <div>
        <h3>Items</h3>
        <ItemSelector items={AVAILABLE_ITEMS} onSelect={handleSelectItem} />
        <ItemSlots slots={slots} onRemove={handleRemoveSlot} />

        <button
          disabled={slots.length !== 3 || (isGridLocked && currentStep >= 3)}
          style={{ marginTop: "10px" }}
          onClick={handleSolve}
        >
          Solve
        </button>

        {showGameOver && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "40px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <h2>Game Over!</h2>
              <p>No solution found for the current configuration.</p>
              <button
                onClick={handleGameOverRefresh}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
