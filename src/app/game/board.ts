// board.ts
import { Cell, CellState, Coord } from './types';
import { Ship } from './ship';

export class Board {
  size: number;
  grid: Cell[][];
  ships: Map<string, Ship>;

  constructor(size = 10) {
    this.size = size;
    this.grid = [];
    this.ships = new Map();
    this.makeEmptyGrid();
  }

  private makeEmptyGrid() {
    this.grid = Array.from({ length: this.size }, (_, y) =>
      Array.from({ length: this.size }, (_, x) => ({
        x,
        y,
        state: CellState.Empty,
      }))
    );
  }

  getCell(coord: Coord) {
    return this.grid[coord.y][coord.x];
  }

  withinBounds(coord: Coord) {
    return coord.x >= 0 && coord.x < this.size && coord.y >= 0 && coord.y < this.size;
  }

  placeShip(ship: Ship) {
    // Validate
    for (const c of ship.coords) {
      if (!this.withinBounds(c)) throw new Error('Ship out of bounds');
      const cell = this.getCell(c);
      if (cell.state === CellState.Ship) throw new Error('Ship overlap');
    }

    // Place
    this.ships.set(ship.id, ship);
    for (const c of ship.coords) {
      const cell = this.getCell(c);
      cell.state = CellState.Ship;
      cell.shipId = ship.id;
    }
  }

  // Attempts to receive an attack; returns result object
  receiveAttack(coord: Coord) {
    if (!this.withinBounds(coord)) return { ok: false, reason: 'out_of_bounds' };
    const cell = this.getCell(coord);

    if (cell.state === CellState.Hit || cell.state === CellState.Miss) {
      return { ok: false, reason: 'already_attacked' };
    }

    if (cell.state === CellState.Ship && cell.shipId) {
      cell.state = CellState.Hit;
      const ship = this.ships.get(cell.shipId)!;
      ship.recordHit(coord);
      const sunk = ship.isSunk();
      return { ok: true, hit: true, sunk, shipId: ship.id };
    } else {
      cell.state = CellState.Miss;
      return { ok: true, hit: false };
    }
  }

  allShipsSunk() {
    for (const ship of this.ships.values()) {
      if (!ship.isSunk()) return false;
    }
    return true;
  }

  clear() {
    this.makeEmptyGrid();
    this.ships.clear();
  }
}
