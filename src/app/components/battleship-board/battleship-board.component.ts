import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Cell, CellState } from '../../game/types';
import type { PlayerId } from '../../game/game';

@Component({
  selector: 'app-battleship-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './battleship-board.component.html',
  styleUrls: ['./battleship-board.component.scss']
})
export class BattleshipBoardComponent implements OnInit {
  @Input() mode: 'own' | 'opponent' = 'opponent'; // which visualization mode
  @Input() viewer: PlayerId = 1; // which player is looking at this board

  board = signal<Cell[][]>([]);
  status = signal('');

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.refreshBoard();
  }

  refreshBoard() {
    if (this.mode === 'own') {
      this.board.set(this.gameService.getOwnBoardView(this.viewer));
    } else {
      this.board.set(this.gameService.getOpponentBoardView(this.viewer));
    }
  }

  // only used when the board is the opponent's board (to attack)
  onCellClick(x: number, y: number) {
    if (this.mode !== 'opponent') return;

    const res = this.gameService.attackOpponent(this.viewer, x, y);
    if (!res.ok) {
      this.status.set(`Invalid: ${res.reason}`);
      return;
    }

    // immediate refresh so player sees hit/miss
    this.refreshBoard();
  }

  cellClass(cell: any) {
    if (cell.state === CellState.Hit) return 'hit';
    if (cell.state === CellState.Miss) return 'miss';
    if (this.mode === 'own' && cell.state === CellState.Ship) return 'ship';
    return 'unknown';
  }
}
