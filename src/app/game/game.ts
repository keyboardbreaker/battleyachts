import { Board } from './board';
import { placeShipsRandomly } from './randomPlacement';
import { Coord } from './types';

export class Game {
  playerBoard: Board;   // player's ships
  enemyBoard: Board;    // AI ships (hidden)
  size: number;
  moves: number;

  constructor(size = 10, shipLengths = [5,4,3,3,2]) {
    this.size = size;
    this.playerBoard = new Board(size);
    this.enemyBoard = new Board(size);
    this.moves = 0;

    // Example: auto-place enemy ships
    placeShipsRandomly(this.enemyBoard, shipLengths);
  }

  startWithPlayerShips(shipLengths = [5,4,3,3,2]) {
    placeShipsRandomly(this.playerBoard, shipLengths);
  }

  playerAttack(coord: Coord) {
    // Attack enemy board
    this.moves++;
    return this.enemyBoard.receiveAttack(coord);
  }

  aiRandomAttack() {
    // Simple AI: random untried cell
    while (true) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);
      const cell = this.playerBoard.getCell({ x, y });
      if (cell.state === 'hit' || cell.state === 'miss') continue;
      return this.playerBoard.receiveAttack({ x, y });
    }
  }

  checkWin() {
    if (this.enemyBoard.allShipsSunk()) return 'player';
    if (this.playerBoard.allShipsSunk()) return 'enemy';
    return null;
  }
}
