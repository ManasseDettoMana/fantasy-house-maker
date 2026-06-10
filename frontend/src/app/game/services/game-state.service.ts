import { Injectable, inject, signal, computed } from '@angular/core';
import { MapGeneratorService } from './map-generator.service';
import { MapRegistryService } from './map-registry.service';
import {
  Position, GamePhase, BattleState,
  WALL, GOBLIN, POTION, DOOR, EMPTY, MAX_LP
} from '../models/game.models';

const DELTAS: Record<string, Position> = {
  w: { r: -1, c:  0 },
  s: { r:  1, c:  0 },
  a: { r:  0, c: -1 },
  d: { r:  0, c:  1 },
};

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private readonly gen      = inject(MapGeneratorService);
  private readonly registry = inject(MapRegistryService);

  readonly playerLp  = signal(MAX_LP);
  readonly mapId     = signal(0);
  readonly pos       = signal<Position>({ r: 1, c: 1 });
  readonly phase     = signal<GamePhase>('exploring');
  readonly message   = signal<string | null>(null);
  readonly battle    = signal<BattleState | null>(null);

  readonly currentMap = computed(() => this.registry.maps[this.mapId()]);

  startGame(): void {
    this.registry.reset();
    const grid = this.gen.generaMappa(10, 10);
    const id   = this.registry.aggiungiMappa(grid);
    this.mapId.set(id);
    this.playerLp.set(MAX_LP);
    this.pos.set(this.gen.posizioneIniziale(grid));
    this.phase.set('exploring');
    this.message.set('Trova le porte (D) per esplorare nuove aree!');
    this.battle.set(null);
  }

  move(dir: string): void {
    if (this.phase() !== 'exploring') return;
    const delta = DELTAS[dir.toLowerCase()];
    if (!delta) { this.message.set('Usa WASD o i pulsanti.'); return; }

    const { r, c }   = this.pos();
    const nr = r + delta.r, nc = c + delta.c;
    const grid       = this.currentMap();
    const R = grid.length, C = grid[0].length;

    if (nr < 0 || nr >= R || nc < 0 || nc >= C) { this.message.set('Bordo della mappa.'); return; }

    const cell = grid[nr][nc];

    if (cell === WALL) { this.message.set('Un muro blocca il passaggio.'); return; }

    this.pos.set({ r: nr, c: nc });
    this.message.set(null);

    if (cell === GOBLIN) {
      const enemyLp = 40 + Math.floor(Math.random() * 41);
      this.battle.set({ enemyLp, playerLp: this.playerLp(), log: ['Un goblin ti attacca!'] });
      this.phase.set('battle');
      return;
    }

    if (cell === POTION) {
      const heal  = 15 + Math.floor(Math.random() * 16);
      const after = Math.min(this.playerLp() + heal, MAX_LP);
      const gained = after - this.playerLp();
      grid[nr][nc] = EMPTY;
      this.playerLp.set(after);
      this.message.set(`Pozione! +${gained} LP → ${after}/${MAX_LP}`);
      return;
    }

    if (cell === DOOR) {
      const result = this.registry.attraversaPorta(this.mapId(), nr, nc);
      if (result) {
        this.mapId.set(result.mapId);
        this.pos.set(result.pos);
        const m = this.registry.maps[result.mapId];
        this.message.set(`Nuova area! Mappa #${result.mapId} (${m.length}×${m[0].length})`);
      }
    }
  }

  attackBattle(): void {
    if (this.phase() !== 'battle') return;
    const b = this.battle()!;
    const log = [...b.log];

    const playerDmg = 10 + Math.floor(Math.random() * 16);
    const newEnemyLp = Math.max(0, b.enemyLp - playerDmg);
    log.push(`Colpisci per ${playerDmg} danni! (goblin: ${newEnemyLp} LP)`);

    if (newEnemyLp <= 0) {
      const { r, c } = this.pos();
      this.currentMap()[r][c] = EMPTY;
      log.push('Goblin sconfitto!');
      this.battle.set({ ...b, enemyLp: 0, log });
      setTimeout(() => {
        this.battle.set(null);
        this.phase.set('exploring');
        this.message.set('Vittoria! Il goblin è caduto.');
      }, 900);
      return;
    }

    const enemyDmg = 5 + Math.floor(Math.random() * 11);
    const newPlayerLp = Math.max(0, this.playerLp() - enemyDmg);
    log.push(`Il goblin ti colpisce per ${enemyDmg} danni! (tu: ${newPlayerLp} LP)`);
    this.playerLp.set(newPlayerLp);

    if (newPlayerLp <= 0) {
      log.push('Sei stato sconfitto...');
      this.battle.set({ enemyLp: newEnemyLp, playerLp: 0, log });
      setTimeout(() => this.phase.set('dead'), 1200);
      return;
    }

    this.battle.set({ enemyLp: newEnemyLp, playerLp: newPlayerLp, log });
  }

  fleeBattle(): void {
    if (this.phase() !== 'battle') return;
    this.battle.set(null);
    this.phase.set('exploring');
    this.message.set('Sei fuggito!');
  }
}