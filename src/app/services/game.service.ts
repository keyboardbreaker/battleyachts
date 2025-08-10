import { Injectable } from '@angular/core';
import { Game } from '../game/game';
import { CellState } from '../game/types';

@Injectable({ providedIn: 'root' })
export class GameService {
  game: Game;

  constructor() {
    this.game = new Game(10);
    this.game.startWithPlayerShips();
  }

// game.service.ts
getPlayerBoardView() {
    const view = [];
    for (let y = 0; y < this.game.size; y++) {
      const row = [];
      for (let x = 0; x < this.game.size; x++) {
        // Directly show cell state from playerBoard
        row.push(this.game.playerBoard.getCell({ x, y }));
      }
      view.push(row);
    }
    return view;
  }
  
  getOpponentBoardView() {
    const view = [];
    for (let y = 0; y < this.game.size; y++) {
      const row = [];
      for (let x = 0; x < this.game.size; x++) {
        const cell = this.game.enemyBoard.getCell({ x, y });
        // Hide ships
        if (cell.state === CellState.Ship) {
          row.push({ ...cell, state: CellState.Empty });
        } else {
          row.push(cell);
        }
      }
      view.push(row);
    }
    return view;
  }
  

  attackEnemy(x: number, y: number) {
    const result = this.game.playerAttack({ x, y });
    if (result.ok) {
      this.game.aiRandomAttack();
    }
    return result;
  }

  getWinner() {
    return this.game.checkWin();
  }
}
