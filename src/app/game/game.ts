import { Board } from './board';
import { placeShipsRandomly } from './randomPlacement';
import { Coord } from './types';

export type PlayerId = 1 | 2;

export class Game {
  player1Board: Board;
  player2Board: Board;
  size: number;
  currentPlayer: PlayerId;

  constructor(size = 10, shipLengths = [5, 4, 3, 3, 2]) {
    this.size = size;
    this.player1Board = new Board(size);
    this.player2Board = new Board(size);
    this.currentPlayer = 1;
    // default: random place both sides for quick start (you can add manual placement later)
    placeShipsRandomly(this.player1Board, shipLengths);
    placeShipsRandomly(this.player2Board, shipLengths);
  }

  getBoardForPlayer(player: PlayerId) {
    return player === 1 ? this.player1Board : this.player2Board;
  }

  getOpponentBoard(player: PlayerId) {
    return player === 1 ? this.player2Board : this.player1Board;
  }

  // current player attacks opponent at coord
  attackByCurrentPlayer(coord: Coord) {
    const opponent = this.getOpponentBoard(this.currentPlayer);
    const res = opponent.receiveAttack(coord);
    // only switch turn if attack was ok (invalid moves don't progress turn)
    if (res.ok) {
      // don't switch if game ends immediately (optional: still switch but unnecessary)
      if (!opponent.allShipsSunk()) {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      }
    }
    return res;
  }

  // convenience: check if a player has lost
  isPlayerDefeated(player: PlayerId) {
    const board = this.getBoardForPlayer(player);
    return board.allShipsSunk();
  }

  // reset or new game helper
  reset(shipLengths = [5, 4, 3, 3, 2]) {
    this.player1Board.clear();
    this.player2Board.clear();
    placeShipsRandomly(this.player1Board, shipLengths);
    placeShipsRandomly(this.player2Board, shipLengths);
    this.currentPlayer = 1;
  }
}
