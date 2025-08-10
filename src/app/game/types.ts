export type Coord = { x: number; y: number };

export enum CellState {
  Empty = 'empty',
  Ship = 'ship',
  Hit = 'hit',
  Miss = 'miss',
}

export interface Cell {
  x: number;
  y: number;
  state: CellState;
  shipId?: string; // undefined for empty/miss
}
