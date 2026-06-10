import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { MAX_LP } from '../../models/game.models';

@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hud">
      <div class="hud-left">
        <span class="label">LP</span>
        <div class="lp-bar-track">
          <div class="lp-bar-fill" [style.width.%]="lpPercent()"></div>
        </div>
        <span class="lp-value">{{ gs.playerLp() }}/{{ maxLp }}</span>
      </div>
      <div class="hud-right">
        <span class="label">Mappa</span>
        <span class="map-badge">#{{ gs.mapId() }}</span>
        @if (mapDims()) {
          <span class="label dim-label">{{ mapDims() }}</span>
        }
      </div>
    </div>
    @if (gs.message()) {
      <div class="message-bar">{{ gs.message() }}</div>
    }
  `,
  styles: [`
    .hud {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: #0d1424;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      gap: 16px;
    }
    .hud-left { display: flex; align-items: center; gap: 8px; flex: 1; }
    .hud-right { display: flex; align-items: center; gap: 8px; }
    .label {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: .08em;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
    }
    .dim-label { font-size: 11px; color: rgba(255,255,255,0.25); }
    .lp-bar-track {
      flex: 1;
      height: 4px;
      background: rgba(255,255,255,0.08);
      border-radius: 2px;
      overflow: hidden;
    }
    .lp-bar-fill {
      height: 100%;
      background: #4ade80;
      border-radius: 2px;
      transition: width .3s ease, background .3s ease;
    }
    .lp-value {
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      min-width: 60px;
      text-align: right;
    }
    .map-badge {
      font-size: 13px;
      font-weight: 500;
      color: #7dd3fc;
    }
    .message-bar {
      padding: 7px 16px;
      font-size: 12px;
      color: rgba(255,255,255,0.55);
      background: #0b1120;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export default class HudComponent {
  protected readonly gs     = inject(GameStateService);
  protected readonly maxLp  = MAX_LP;

  protected readonly lpPercent = computed(() =>
    Math.round((this.gs.playerLp() / MAX_LP) * 100)
  );

  protected readonly mapDims = computed(() => {
    const m = this.gs.currentMap();
    return m ? `${m.length}×${m[0].length}` : null;
  });
}