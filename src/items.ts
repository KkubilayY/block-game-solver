import { Item } from "./types";

export const AVAILABLE_ITEMS: Item[] = [
  
  // Dot
  {
    id: "Dot",
    name: "Dot",
    color: "BlueViolet",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  // Diagonals
  {
    id: "Diagonal1",
    name: "Dia1",
    color: "red",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Diagonal2",
    name: "Dia2",
    color: "red",
    cells: [
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Diagonal3",
    name: "Dia3",
    color: "Chocolate",
    cells: [
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Diagonal4",
    name: "Dia4",
    color: "Chocolate",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  // Small Ls
  
  {
    id: "SmallL1",
    name: "SL1",
    color: "SaddleBrown",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "SmallL2",
    name: "SL2",
    color: "SaddleBrown",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "SmallL3",
    name: "SL3",
    color: "SaddleBrown",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "SmallL4",
    name: "SL4",
    color: "SaddleBrown",
    cells: [
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  // Small Lines
  {
    id: "Line1",
    name: "Line 1x2",
    color: "DarkBlue",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Line2",
    name: "Line 2x1",
    color: "DarkBlue",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Line3",
    name: "Line 1x3",
    color: "DarkCyan",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Line4",
    name: "Line 3x1",
    color: "DarkCyan",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  // Zs
  {
    id: "Z1",
    name: "Z Shape 1",
    color: "DarkOliveGreen",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Z2",
    name: "Z Shape 2",
    color: "DarkOliveGreen",
    cells: [
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Z3",
    name: "Z Shape 3",
    color: "DarkGreen",
    cells: [
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Z4",
    name: "Z Shape 4",
    color: "DarkGreen",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  // Small Ls
  {
    id: "L1",
    name: "L Shape 1",
    color: "DarkMagenta",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "L5",
    name: "L Shape 5",
    color: "DarkMagenta",
    cells: [
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "L2",
    name: "L Shape 2",
    color: "DarkOrange",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "L6",
    name: "L Shape 6",
    color: "DarkOrange",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "L3",
    name: "L Shape 3",
    color: "DarkOrchid",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "L4",
    name: "L Shape 4",
    color: "DarkOrchid",
    cells: [
      { localRowIndex: 0, localColIndex: 2  , gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "L7",
    name: "L Shape 7",
    color: "MediumPurple",
    cells: [
      { localRowIndex: 0, localColIndex: 0  , gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "L8",
    name: "L Shape 8",
    color: "MediumPurple",
    cells: [
      { localRowIndex: 0, localColIndex: 0  , gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  // Small Ts
  {
    id: "Tup",
    name: "T Shape Up",
    color: "DarkSlateGray",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Tdown",
    name: "T Shape Down",
    color: "DarkSlateGray",
    cells: [
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Tleft",
    name: "T Shape Left",
    color: "DarkSalmon",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Tright",
    name: "T Shape Right",
    color: "DarkSalmon",
    cells: [
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  // Plus
  {
    id: "Plus",
    name: "Plus Shape",
    color: "IndianRed",
    cells: [
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  
  // Squares
  {
    id: "SQUARE2",
    name: "Square 2x2",
    color: "ForestGreen",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  {
    id: "SQUARE3",
    name: "Square 3x3",
    color: "DeepPink",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  // Double lines
  {
    id: "DL1",
    name: "Double Line 3x2",
    color: "YellowGreen",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "DL2",
    name: "Double Line 2x3",
    color: "YellowGreen",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  // Big Ls
  {
    id: "Big L1",
    name: "Big L Shape 1",
    color: "GoldenRod",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big L2",
    name: "Big L Shape 2",
    color: "GoldenRod",
    cells: [
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big L3",
    name: "Big L Shape 3",
    color: "Indigo",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big L4",
    name: "Big L Shape 4",
    color: "Indigo",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  // Big Ts
  {
    id: "Big T1",
    name: "Big T Shape 1",
    color: "LightCoral",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  {
    id: "Big T2",
    name: "Big T Shape 2",
    color: "LightCoral",
    cells: [
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big T3",
    name: "Big T Shape 3",
    color: "LightSeaGreen",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big T4",
    name: "Big T Shape 4",
    color: "LightSeaGreen",
    cells: [
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },

  // Big lines
  {
    id: "Big Line1",
    name: "Line 1x4",
    color: "MediumVioletRed",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 3, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big Line2",
    name: "Line 4x1",
    color: "MediumVioletRed",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 3, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big Line3",
    name: "Line 1x5",
    color: "MidnightBlue",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 3, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 4, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big Line4",
    name: "Line 5x1",
    color: "MidnightBlue",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 3, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 4, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big Line5",
    name: "Line 1x6",
    color: "Olive",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 3, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 4, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 5, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big Line6",
    name: "Line 6x1",
    color: "Olive",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 3, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 4, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 5, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big Line7",
    name: "Line 1x7",
    color: "Tomato",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 1, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 2, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 3, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 4, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 5, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 0, localColIndex: 6, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
  {
    id: "Big Line8",
    name: "Line 7x1",
    color: "Tomato",
    cells: [
      { localRowIndex: 0, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 1, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 2, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 3, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 4, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 5, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
      { localRowIndex: 6, localColIndex: 0, gridRowIndex: -1, gridColIndex: -1 },
    ],
  },
];
