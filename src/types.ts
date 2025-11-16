export interface GridCell
{
    rowIndex: number;
    colIndex: number;
    occupied: boolean;
    color?: string;
    isPreview?: boolean;
}

// Each cell inside a local item (e.g., L-shaped piece)
export interface LocalCell {
  localRowIndex: number;   // row index inside the local item
  localColIndex: number;   // column index inside the local item
  gridRowIndex: number;    // corresponding row on the grid (-1 if not placed)
  gridColIndex: number;    // corresponding column on the grid (-1 if not placed)
}

export interface Item {
  id: string; // unique identifier
  name: string;
  color: string; // for display
  cells: LocalCell[]; // shape definition
}