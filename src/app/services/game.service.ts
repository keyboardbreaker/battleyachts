import { Injectable, signal } from '@angular/core';
import { Game, PlayerId } from '../game/game';
import { CellState } from '../game/types';

@Injectable({ providedIn: 'root' })
export class GameService {
  game = signal(new Game(10));
  // reactive convenience signals
  currentPlayer = signal<Game['currentPlayer']>(this.game().currentPlayer);

  constructor() {
    // keep service signals in sync if game mutates
    this.currentPlayer.set(this.game().currentPlayer);
  }

  // Return a view of the viewer's own board (ships visible)
  getOwnBoardView(forPlayer: PlayerId) {
    const board = this.game().getBoardForPlayer(forPlayer);
    return board.grid; // return cell objects as-is => ships visible
  }

  // Return a view of the opponent board (ships masked unless hit)
  getOpponentBoardView(forPlayer: PlayerId) {
    const opponentBoard = this.game().getOpponentBoard(forPlayer);
    return opponentBoard.grid.map(row =>
      row.map(cell => {
        if (cell.state === CellState.Ship) {
          // mask ships that haven't been hit
          return { ...cell, state: CellState.Empty };
        }
        return cell;
      })
    );
  }

  // Player attempts an attack on opponent; service handles switching the game's currentPlayer
  attackOpponent(forPlayer: PlayerId, x: number, y: number) {
    // ensure the forPlayer matches game.currentPlayer
    if (this.game().currentPlayer !== forPlayer) {
      return { ok: false, reason: 'not_your_turn' };
    }

    const res = this.game().attackByCurrentPlayer({ x, y });

    // sync signal
    this.currentPlayer.set(this.game().currentPlayer);

    return res;
  }

  // small helpers
  switchPlayer() {
    const g = this.game();
    g.currentPlayer = g.currentPlayer === 1 ? 2 : 1;
    this.game.set(g);
    this.currentPlayer.set(g.currentPlayer);
  }

  getCurrentPlayer() {
    return this.game().currentPlayer;
  }

  isPlayerDefeated(player: PlayerId) {
    return this.game().isPlayerDefeated(player);
  }

  reset() {
    const g = this.game();
    g.reset();
    this.game.set(g);
    this.currentPlayer.set(g.currentPlayer);
  }
}
