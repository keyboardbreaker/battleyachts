import { Component } from '@angular/core';
import { BattleshipBoardComponent } from './components/battleship-board/battleship-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BattleshipBoardComponent],
  template: `
    <h1>Battleship</h1>
    <div class="boards">
      <div>
        <h2>Your Board</h2>
        <app-battleship-board mode="player"></app-battleship-board>
      </div>
      <div>
        <h2>Opponent's Board</h2>
        <app-battleship-board mode="opponent"></app-battleship-board>
      </div>
    </div>
  `,
  styles: [`
    .boards { display: flex; gap: 2rem; }
  `]
})
export class AppComponent {}
