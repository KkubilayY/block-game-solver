import React from "react";
import { Item } from "./types";
import "./ItemSelector.css";

interface Props {
  items: Item[];
  onSelect: (item: Item) => void;
}

const getItemSize = (item: Item) => {
  const maxRow = Math.max(...item.cells.map((c) => c.localRowIndex)) + 1;
  const maxCol = Math.max(...item.cells.map((c) => c.localColIndex)) + 1;
  return Math.max(maxRow, maxCol);
};

const ItemSelector: React.FC<{
  items: Item[];
  onSelect: (item: Item) => void;
}> = ({ items, onSelect }) => {
  const getItemSize = (item: Item) => {
    const maxRow = Math.max(...item.cells.map((c) => c.localRowIndex)) + 1;
    const maxCol = Math.max(...item.cells.map((c) => c.localColIndex)) + 1;
    return Math.max(maxRow, maxCol);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        alignItems: "center",
      }}
    >
      {items.map((item) => {
        const n = getItemSize(item);

        return (
          <div
            key={item.id}
            className="item-box"
            onClick={() => onSelect(item)}
            style={{
              width: n * 20 + 10,
              height: n * 20 + 10,
              flexShrink: 0,
            }}
          >
            <div
              className="dynamic-item-grid"
              style={{
                gridTemplateColumns: `repeat(${n}, 16px)`,
                gridTemplateRows: `repeat(${n}, 16px)`,
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
                      className="item-cell"
                      style={{
                        backgroundColor: filled ? item.color : "#ccc",
                      }}
                    ></div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItemSelector;
