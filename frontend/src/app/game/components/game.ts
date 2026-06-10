import {
  Component, inject, OnInit, OnDestroy,
  HostListener, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../services/game-state.service';
import HudComponent    from '../components/hud/hud';
import GridComponent   from '../components/grid/grid';
import BattleComponent from '../components/battle/battle';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, HudComponent, GridComponent, BattleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="game-shell">

      @if (gs.phase() === 'exploring' || gs.phase() === 'battle') {
        <app-hud />
        <div class="game-area">
          <app-grid />
          @if (gs.phase() === 'battle') {
            <app-battle />
          }
        </div>
        <div class="controls">
          <div class="dpad">
            <button class="dpad-btn"  (click)="gs.move('w')">▲</button>
            <button class="dpad-btn"  (click)="gs.move('a')">◀</button>
            <div class="dpad-center"></div>
            <button class="dpad-btn"  (click)="gs.move('d')">▶</button>
            <button class="dpad-btn"  (click)="gs.move('s')">▼</button>
          </div>
          <div class="legend">
            <span><span class="ico player-ico">@</span> Tu</span>
            <span><span class="ico goblin-ico">G</span> Goblin</span>
            <span><span class="ico potion-ico">!</span> Pozione</span>
            <span><span class="ico door-ico">D</span> Porta</span>
          </div>
        </div>
      }

      @if (gs.phase() === 'dead') {
        <div class="end-screen">
          <p class="end-title dead">GAME OVER</p>
          <p class="end-sub">Sei stato sconfitto dal goblin.</p>
          <button class="restart-btn" (click)="gs.startGame()">Rigioca</button>
        </div>
      }

      @if (gs.phase() === 'exploring' && !gs.currentMap()) {
        <div class="end-screen">
          <p class="end-title">Goblin Slayer</p>
          <button class="restart-btn" (click)="gs.startGame()">Inizia</button>
        </div>
      }

    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }

    .game-shell {
      height: 100%;
      min-height: 100vh;
      background: #0d1424;
      display: flex;
      flex-direction: column;
      color: #fff;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .game-area {
      flex: 1;
      min-height: 0;
      position: relative;
      overflow: hidden;
      display: flex;
    }

    .controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      background: #0a0f1a;
      border-top: 1px solid rgba(255,255,255,0.07);
      gap: 20px;
    }

    .dpad {
      display: grid;
      grid-template-columns: repeat(3, 36px);
      grid-template-rows: repeat(3, 36px);
      gap: 3px;
    }
    .dpad-btn {
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      color: rgba(255,255,255,0.7);
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .1s;
    }
    .dpad-btn:hover  { background: rgba(255,255,255,0.12); }
    .dpad-btn:active { background: rgba(255,255,255,0.18); transform: scale(.95); }
    .dpad-center { width: 36px; height: 36px; }

    .dpad-btn:nth-child(1) { grid-column: 2; grid-row: 1; }
    .dpad-btn:nth-child(2) { grid-column: 1; grid-row: 2; }
    .dpad-center            { grid-column: 2; grid-row: 2; }
    .dpad-btn:nth-child(4) { grid-column: 3; grid-row: 2; }
    .dpad-btn:nth-child(5) { grid-column: 2; grid-row: 3; }

    .legend {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }
    .legend span {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: rgba(255,255,255,0.4);
    }
    .ico {
      font-size: 13px;
      font-weight: 700;
      width: 18px;
      text-align: center;
    }
    .player-ico { color: #7dd3fc; }
    .goblin-ico { color: #f87171; }
    .potion-ico { color: #4ade80; }
    .door-ico   { color: #a78bfa; }

    .end-screen {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background: #0d1424;
    }
    .end-title {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: .06em;
      color: rgba(255,255,255,0.85);
      margin: 0;
    }
    .end-title.dead { color: #f87171; }
    .end-sub {
      font-size: 14px;
      color: rgba(255,255,255,0.35);
      margin: 0;
    }
    .restart-btn {
      margin-top: 8px;
      padding: 12px 32px;
      background: rgba(125,211,252,0.1);
      border: 1px solid rgba(125,211,252,0.3);
      border-radius: 6px;
      color: #7dd3fc;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: background .15s;
    }
    .restart-btn:hover { background: rgba(125,211,252,0.18); }
  `]
})
export default class GameComponent implements OnInit, OnDestroy {
  protected readonly gs = inject(GameStateService);

  ngOnInit(): void {
    this.gs.startGame();
  }

  ngOnDestroy(): void {}

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    const key = e.key.toLowerCase();
    if (['w','a','s','d'].includes(key)) {
      e.preventDefault();
      if (this.gs.phase() === 'exploring') this.gs.move(key);
      else if (this.gs.phase() === 'battle') {
        if (key === 'a') this.gs.attackBattle();
        if (key === 'r') this.gs.fleeBattle();
      }
    }
    if (key === 'r' && this.gs.phase() === 'dead') this.gs.startGame();
  }
}