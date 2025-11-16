import React from "react";
import { Item } from "./types";
import "./ItemSlots.css";

interface Props {
  slots: Item[];
  onRemove: (index: number) => void;
}

const getItemSize = (item: Item) => {
  const maxRow = Math.max(...item.cells.map((c) => c.localRowIndex)) + 1;
  const maxCol = Math.max(...item.cells.map((c) => c.localColIndex)) + 1;
  return Math.max(maxRow, maxCol);
};

const ItemSlots: React.FC<{
  slots: Item[];
  onRemove: (index: number) => void;
}> = ({ slots, onRemove }) => {
  const getItemSize = (item: Item) => {
    const maxRow = Math.max(...item.cells.map((c) => c.localRowIndex)) + 1;
    const maxCol = Math.max(...item.cells.map((c) => c.localColIndex)) + 1;
    return Math.max(maxRow, maxCol);
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      {Array.from({ length: 3 }).map((_, idx) => {
        const item = slots[idx];

        if (!item)
          return (
            <div
              key={idx}
              style={{
                border: "1px solid #999",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "4px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#eee",
                }}
              />
            </div>
          );

        const n = getItemSize(item);

        return (
          <div
            key={idx}
            style={{
              position: "relative",
              border: "1px solid #999",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "4px",
              width: n * 20 + 10,
              height: n * 20 + 10,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${n}, 16px)`,
                gridTemplateRows: `repeat(${n}, 16px)`,
                gap: "2px",
              }}
            >
              {Array.from({ length: n }).map((_, row) =>
                Array.from({ length: n }).map((__, col) => {
                  const filled = item.cells.some(
                    (c) => c.localRowIndex === row && c.localColIndex === col
                  );

                  return (
                    <div
                      key={`${row}-${col}`}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: filled ? item.color : "#ccc",
                      }}
                    ></div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => onRemove(idx)}
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ItemSlots;
