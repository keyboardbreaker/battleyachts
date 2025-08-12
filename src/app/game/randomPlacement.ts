// randomPlacement.ts
import { Board } from './board';
import { Ship } from './ship';
import { Coord } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Randomly place ships on a board using simple "try until fits" approach.
 * shipsToPlace is an array of lengths, e.g. [5,4,3,3,2]
 */
export function placeShipsRandomly(board: Board, shipsToPlace: number[]) {
  board.clear();

  function coordsFor(x: number, y: number, len: number, horizontal: boolean): Coord[] {
    const coords: Coord[] = [];

    for (let i = 0; i < len; i++) {
      coords.push({
        x: x + (horizontal ? i : 0),
        y: y + (horizontal ? 0 : i),
      });
    }
  
    return coords;
  }

  for (const len of shipsToPlace) {
    let placed = false;
    let attempts = 0;
    while (!placed) {
      if (++attempts > 2000) throw new Error('Unable to place ships after many attempts');
      const horizontal = Math.random() < 0.5;
      const x = Math.floor(Math.random() * board.size);
      const y = Math.floor(Math.random() * board.size);
      const startX = x;
      const startY = y;
      const endX = startX + (horizontal ? len - 1 : 0);
      const endY = startY + (horizontal ? 0 : len - 1);
      if (endX >= board.size || endY >= board.size) continue;
      const coords = coordsFor(startX, startY, len, horizontal);
      // check overlap
      let ok = true;
      for (const c of coords) {
        if (board.getCell(c).state === 'ship') { ok = false; break; }
      }
      if (!ok) continue;

      const ship = new Ship(uuidv4(), len, coords);
      board.placeShip(ship);
      placed = true;
    }
  }
}
