import { Component, signal } from '@angular/core';
import { BattleshipBoardComponent } from './components/battleship-board/battleship-board.component';
import { GameService } from './services/game.service';
import type { PlayerId } from './game/game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BattleshipBoardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  showBoards = signal(false);
  currentPlayer = signal<PlayerId>(1);

  constructor(private gameService: GameService) {
    this.currentPlayer.set(this.gameService.getCurrentPlayer());
  }

  nextPlayer() {
    return this.gameService.getCurrentPlayer() === 1 ? 2 as PlayerId : 1 as PlayerId;
  }

  revealBoards() {
    // sync current player from service and show boards
    this.currentPlayer.set(this.gameService.getCurrentPlayer());
    this.showBoards.set(true);
  }

  endTurn() {
    // Player indicates done and passes device; the service already switched currentPlayer during attack.
    // Hide boards to allow safe handover and refresh currentPlayer
    this.showBoards.set(false);
    // ensure the next player is up-to-date from service (in case last attack switched)
    this.currentPlayer.set(this.gameService.getCurrentPlayer());
  }

  newGame() {
    this.gameService.reset();
    this.showBoards.set(false);
    this.currentPlayer.set(this.gameService.getCurrentPlayer());
  }
}
