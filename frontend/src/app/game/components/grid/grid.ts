import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { WALL, GOBLIN, POTION, DOOR } from '../../models/game.models';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid-wrapper">
      <div
        class="map-grid"
        [style.grid-template-columns]="'repeat(' + cols() + ', 1fr)'"
      >
        @for (cell of flatCells(); track $index) {
          <div
            class="cell"
            [class.wall]="cell.type === WALL"
            [class.player]="cell.isPlayer"
            [class.goblin]="cell.type === GOBLIN"
            [class.potion]="cell.type === POTION"
            [class.door]="cell.type === DOOR"
          >
            @if (cell.isPlayer) { <span class="icon">@</span> }
            @else if (cell.type === GOBLIN) { <span class="icon">G</span> }
            @else if (cell.type === POTION) { <span class="icon">!</span> }
            @else if (cell.type === DOOR)   { <span class="icon">D</span> }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .grid-wrapper {
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
      padding: 20px;
      background: #0d1424;
    }
    .map-grid {
      display: grid;
      gap: 1px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06);
    }
    .cell {
      width: 38px;
      height: 38px;
      background: #111b2e;
      border: 1px solid rgba(255,255,255,0.07);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      transition: background .15s;
    }
    .wall   { background: #0a0f1a; border-color: rgba(255,255,255,0.03); }
    .player { background: #1e3a5f; border-color: rgba(125,211,252,0.4); }
    .goblin { background: #2a1010; border-color: rgba(248,113,113,0.3); }
    .potion { background: #0f2a15; border-color: rgba(74,222,128,0.3); }
    .door   { background: #1e1040; border-color: rgba(167,139,250,0.35); }
    .icon   { line-height: 1; user-select: none; }
    .player .icon { color: #7dd3fc; }
    .goblin .icon { color: #f87171; }
    .potion .icon { color: #4ade80; }
    .door   .icon { color: #a78bfa; }
  `]
})
export default class GridComponent {
  protected readonly gs   = inject(GameStateService);
  protected readonly WALL = WALL;
  protected readonly GOBLIN = GOBLIN;
  protected readonly POTION = POTION;
  protected readonly DOOR   = DOOR;

  protected readonly cols = computed(() => {
    const m = this.gs.currentMap();
    return m ? m[0].length : 0;
  });

  protected readonly flatCells = computed(() => {
    const grid = this.gs.currentMap();
    const pos  = this.gs.pos();
    if (!grid) return [];
    return grid.flatMap((row, r) =>
      row.map((type, c) => ({
        type,
        isPlayer: r === pos.r && c === pos.c
      }))
    );
  });
}