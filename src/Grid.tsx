import React from "react";
import { GridCell } from "./types";
import "./Grid.css";
import exp from "constants";

interface GridProps {
  grid: GridCell[][];
  setGrid: React.Dispatch<React.SetStateAction<GridCell[][]>>;
  isLocked: boolean;
}

const Grid: React.FC<{
  grid: GridCell[][];
  setGrid: React.Dispatch<React.SetStateAction<GridCell[][]>>;
  isLocked: boolean;
}> = ({ grid, setGrid, isLocked }) => {
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (isLocked) return;

    const newGrid = grid.map((row) =>
      row.map((cell) =>
        cell.rowIndex === rowIndex && cell.colIndex === colIndex
          ? {
              ...cell,
              occupied: !cell.occupied,
              color: cell.occupied ? undefined : "#e8744f",
            }
          : cell
      )
    );
    setGrid(newGrid);
  };

  return (
    <div style={{ display: "inline-block", border: "2px solid #333" }}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell) => (
            <div
              key={cell.colIndex}
              style={{
                width: "50px",
                height: "50px",
                border: "1px solid #999",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isLocked ? "not-allowed" : "pointer",
                userSelect: "none",
                transition: "background-color 0.2s",
                backgroundColor: cell.occupied
                  ? cell.isPreview
                    ? "#4caf50"
                    : cell.color || "#e8744f"
                  : "white",
                color: cell.occupied ? "white" : "#999",
                fontSize: "10px",
                opacity: isLocked && !cell.occupied ? 0.5 : 1,
              }}
              onClick={() => handleCellClick(cell.rowIndex, cell.colIndex)}
            >
              {cell.rowIndex},{cell.colIndex}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
