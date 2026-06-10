import { Injectable, inject } from '@angular/core';
import { MapGeneratorService } from './map-generator.service';
import { MapGrid, Side, Position, Connection, DOOR } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class MapRegistryService {
  private readonly gen = inject(MapGeneratorService);

  maps: MapGrid[] = [];
  private connections = new Map<string, Connection>();
  private nextId = 0;

  reset(): void {
    this.maps = [];
    this.connections.clear();
    this.nextId = 0;
  }

  aggiungiMappa(grid: MapGrid): number {
    const id = this.nextId++;
    this.maps[id] = grid;
    return id;
  }

  attraversaPorta(mapId: number, r: number, c: number): { mapId: number; pos: Position } | null {
    const grid = this.maps[mapId];
    const R = grid.length, C = grid[0].length;
    const info = this.gen.doorSideIdx(r, c, R, C);
    if (!info) return null;

    const key = `${mapId}:${info.side}:${info.idx}`;

    if (!this.connections.has(key)) {
      const destSide = this.gen.oppositeSide(info.side);
      const { R: newR, C: newC } = this.gen.randomMapSize(destSide, info.idx);
      const newGrid = this.gen.generaMappa(newR, newC);

      const destIdx = info.idx < (destSide === 'N' || destSide === 'S' ? newC : newR)
        ? info.idx : (destSide === 'N' || destSide === 'S' ? newC - 2 : newR - 2);

      const doorPos = this.gen.doorCell(destSide, destIdx, newR, newC);
      newGrid[doorPos.r][doorPos.c] = DOOR;
      const destMapId = this.aggiungiMappa(newGrid);

      this.connections.set(key, { mapId: destMapId, side: destSide, idx: destIdx });
      const backKey = `${destMapId}:${destSide}:${destIdx}`;
      this.connections.set(backKey, { mapId, side: info.side, idx: info.idx });
    }

    const conn = this.connections.get(key)!;
    const destGrid = this.maps[conn.mapId];
    const pos = this.gen.spawnFromDoor(conn.side, conn.idx, destGrid.length, destGrid[0].length);
    return { mapId: conn.mapId, pos };
  }
}