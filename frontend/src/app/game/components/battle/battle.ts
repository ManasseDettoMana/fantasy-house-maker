import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { MAX_LP } from '../../models/game.models';

@Component({
  selector: 'app-battle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="battle-overlay">
      <div class="battle-panel">

        <div class="goblin-art" aria-hidden="true">
{{ goblinArt }}</div>

        <div class="stats-row">
          <div class="stat-block">
            <span class="stat-label">Tu</span>
            <div class="hp-bar-track">
              <div class="hp-bar player-hp"
                [style.width.%]="playerHpPct()"></div>
            </div>
            <span class="stat-val">{{ gs.battle()?.playerLp }}/{{ maxLp }}</span>
          </div>
          <div class="vs-label">VS</div>
          <div class="stat-block">
            <span class="stat-label">Goblin</span>
            <div class="hp-bar-track">
              <div class="hp-bar enemy-hp"
                [style.width.%]="enemyHpPct()"></div>
            </div>
            <span class="stat-val">{{ gs.battle()?.enemyLp }}</span>
          </div>
        </div>

        <div class="log">
          @for (line of gs.battle()?.log ?? []; track $index) {
            <p class="log-line">{{ line }}</p>
          }
        </div>

        <div class="actions">
          <button class="btn btn-attack" (click)="gs.attackBattle()">
            ⚔ Attacca
          </button>
          <button class="btn btn-flee" (click)="gs.fleeBattle()">
            ↩ Fuggi
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .battle-overlay {
      position: absolute;
      inset: 0;
      background: rgba(7,10,20,0.92);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .battle-panel {
      width: 340px;
      background: #0d1424;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .goblin-art {
      font-family: monospace;
      font-size: 12px;
      color: #f87171;
      text-align: center;
      line-height: 1.5;
      white-space: pre;
    }
    .stats-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .stat-block {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: rgba(255,255,255,0.35);
    }
    .stat-val {
      font-size: 13px;
      font-weight: 500;
      color: #fff;
    }
    .hp-bar-track {
      height: 4px;
      background: rgba(255,255,255,0.08);
      border-radius: 2px;
      overflow: hidden;
    }
    .hp-bar {
      height: 100%;
      border-radius: 2px;
      transition: width .3s ease;
    }
    .player-hp { background: #4ade80; }
    .enemy-hp  { background: #f87171; }
    .vs-label {
      font-size: 12px;
      font-weight: 700;
      color: rgba(255,255,255,0.2);
      padding: 0 4px;
    }
    .log {
      max-height: 100px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .log-line {
      margin: 0;
      font-size: 12px;
      color: rgba(255,255,255,0.55);
      line-height: 1.5;
    }
    .log-line:last-child { color: rgba(255,255,255,0.85); }
    .actions {
      display: flex;
      gap: 10px;
    }
    .btn {
      flex: 1;
      padding: 10px 0;
      border-radius: 6px;
      border: 1px solid;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity .15s;
    }
    .btn:hover { opacity: .8; }
    .btn-attack {
      background: rgba(248,113,113,0.12);
      border-color: rgba(248,113,113,0.4);
      color: #f87171;
    }
    .btn-flee {
      background: rgba(255,255,255,0.04);
      border-color: rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.55);
    }
  `]
})
export default class BattleComponent {
  protected readonly gs    = inject(GameStateService);
  protected readonly maxLp = MAX_LP;

  readonly goblinArt =
`     ,      ,
    /(.-""-.)\\
    |  o  o  |
    |   --   |
     \\  __  /
      '----'`;

  protected playerHpPct(): number {
    return Math.round(((this.gs.battle()?.playerLp ?? 0) / MAX_LP) * 100);
  }
  protected enemyHpPct(): number {
    const b = this.gs.battle();
    return b ? Math.round((b.enemyLp / 80) * 100) : 0;
  }
}