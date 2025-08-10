import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { CellState } from '../../game/types';

@Component({
  selector: 'app-battleship-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './battleship-board.component.html',
  styleUrls: ['./battleship-board.component.scss']
})
export class BattleshipBoardComponent {
  @Input() mode: 'player' | 'opponent' = 'opponent';
  status = signal('');
  board = signal<any[][]>([]);

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.status.set('Game ready!');
    this.refreshBoard();
  }

  refreshBoard() {
    if (this.mode === 'player') {
      this.board.set(this.gameService.getPlayerBoardView());
    } else {
      this.board.set(this.gameService.getOpponentBoardView());
    }
  }

  onCellClick(x: number, y: number) {
    if (this.mode === 'opponent') {
      const res = this.gameService.attackEnemy(x, y);
      this.refreshBoard();
    }
  }

  cellClass(cell: any) {
    if (cell.state === CellState.Hit) return 'hit';
    if (cell.state === CellState.Miss) return 'miss';
    if (this.mode === 'player' && cell.state === CellState.Ship) return 'ship';
    return 'unknown';
  }
}
