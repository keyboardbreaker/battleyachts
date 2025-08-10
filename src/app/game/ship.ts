import { Coord } from './types';

export class Ship {
  id: string;
  length: number;
  coords: Coord[];       // coordinates occupied
  hits: Set<string>;    // set of coord keys like "3,4"

  constructor(id: string, length: number, coords: Coord[] = []) {
    this.id = id;
    this.length = length;
    this.coords = coords;
    this.hits = new Set();
  }

  isAt(coord: Coord) {
    return this.coords.some(c => c.x === coord.x && c.y === coord.y);
  }

  recordHit(coord: Coord) {
    this.hits.add(`${coord.x},${coord.y}`);
  }

  isSunk() {
    return this.hits.size >= this.length;
  }
}
