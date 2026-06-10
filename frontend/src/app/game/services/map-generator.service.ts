import { Injectable } from '@angular/core';
import {
  CellType, MapGrid, Position, Side,
  EMPTY, WALL, GOBLIN, POTION, DOOR,
  MAP_MIN, MAP_MAX
} from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class MapGeneratorService {

  generaMappa(R: number = 10, C: number = 10): MapGrid {
    const grid: MapGrid = Array.from({ length: R }, () =>
      Array.from({ length: C }, () => WALL as CellType)
    );
    this.carveMaze(grid, R, C);
    this.piazzaOggetti(grid, R, C);
    this.garantisciConnettivita(grid, R, C);
    return grid;
  }

  private carveMaze(grid: MapGrid, R: number, C: number): void {
    const visited = Array.from({ length: R }, () => new Array(C).fill(false));
    const stack: Position[] = [];
    const startR = 1 + Math.floor(Math.random() * Math.floor((R - 2) / 2)) * 2;
    const startC = 1 + Math.floor(Math.random() * Math.floor((C - 2) / 2)) * 2;
    grid[startR][startC] = EMPTY;
    visited[startR][startC] = true;
    stack.push({ r: startR, c: startC });

    while (stack.length > 0) {
      const { r, c } = stack[stack.length - 1];
      const neighbors: Position[] = [];
      for (const [dr, dc] of [[-2,0],[2,0],[0,-2],[0,2]]) {
        const nr = r + dr, nc = c + dc;
        if (nr > 0 && nr < R - 1 && nc > 0 && nc < C - 1 && !visited[nr][nc]) {
          neighbors.push({ r: nr, c: nc });
        }
      }
      if (neighbors.length === 0) { stack.pop(); continue; }
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      grid[(r + next.r) / 2][(c + next.c) / 2] = EMPTY;
      grid[next.r][next.c] = EMPTY;
      visited[next.r][next.c] = true;
      stack.push(next);
    }
  }

  private piazzaOggetti(grid: MapGrid, R: number, C: number): void {
    const celle = this.celleLibere(grid, R, C, true);
    const shuffle = (a: Position[]) => a.sort(() => Math.random() - 0.5);
    shuffle(celle);

    const n = celle.length;
    const nGoblin  = Math.max(2, Math.floor(n * 0.08));
    const nPozione = Math.max(1, Math.floor(n * 0.04));
    const nPorta   = 2 + Math.floor(Math.random() * 2);

    let idx = 0;
    for (let i = 0; i < nGoblin && idx < n; i++, idx++)
      grid[celle[idx].r][celle[idx].c] = GOBLIN;
    for (let i = 0; i < nPozione && idx < n; i++, idx++)
      grid[celle[idx].r][celle[idx].c] = POTION;

    const bordoCelle = this.celleBordo(grid, R, C);
    shuffle(bordoCelle);
    for (let i = 0; i < nPorta && i < bordoCelle.length; i++)
      grid[bordoCelle[i].r][bordoCelle[i].c] = DOOR;
  }

  private celleBordo(grid: MapGrid, R: number, C: number): Position[] {
    const result: Position[] = [];
    for (let c = 1; c < C - 1; c++) {
      if (grid[1][c] === EMPTY) result.push({ r: 0, c });
      if (grid[R-2][c] === EMPTY) result.push({ r: R-1, c });
    }
    for (let r = 1; r < R - 1; r++) {
      if (grid[r][1] === EMPTY) result.push({ r, c: 0 });
      if (grid[r][C-2] === EMPTY) result.push({ r, c: C-1 });
    }
    return result;
  }

  private celleLibere(grid: MapGrid, R: number, C: number, interneOnly = false): Position[] {
    const result: Position[] = [];
    for (let r = 0; r < R; r++)
      for (let c = 0; c < C; c++) {
        if (grid[r][c] !== EMPTY) continue;
        if (interneOnly && (r === 0 || r === R-1 || c === 0 || c === C-1)) continue;
        result.push({ r, c });
      }
    return result;
  }

  posizioneIniziale(grid: MapGrid): Position {
    const R = grid.length, C = grid[0].length;
    for (let r = 1; r < R - 1; r++)
      for (let c = 1; c < C - 1; c++)
        if (grid[r][c] === EMPTY) return { r, c };
    return { r: 1, c: 1 };
  }

  doorSideIdx(r: number, c: number, R: number, C: number): { side: Side; idx: number } | null {
    if (r === 0)     return { side: 'N', idx: c };
    if (r === R - 1) return { side: 'S', idx: c };
    if (c === 0)     return { side: 'W', idx: r };
    if (c === C - 1) return { side: 'E', idx: r };
    return null;
  }

  oppositeSide(side: Side): Side {
    return ({ N: 'S', S: 'N', E: 'W', W: 'E' } as Record<Side, Side>)[side];
  }

  doorCell(side: Side, idx: number, R: number, C: number): Position {
    if (side === 'N') return { r: 0,     c: idx };
    if (side === 'S') return { r: R - 1, c: idx };
    if (side === 'W') return { r: idx,   c: 0 };
    return                   { r: idx,   c: C - 1 };
  }

  spawnFromDoor(side: Side, idx: number, R: number, C: number): Position {
    const deltas: Record<Side, Position> = { N:{r:1,c:0}, S:{r:-1,c:0}, W:{r:0,c:1}, E:{r:0,c:-1} };
    const door = this.doorCell(side, idx, R, C);
    return { r: door.r + deltas[side].r, c: door.c + deltas[side].c };
  }

  randomMapSize(doorSide: Side, doorIdx: number): { R: number; C: number } {
    let minR = MAP_MIN, minC = MAP_MIN;
    if (doorSide === 'W' || doorSide === 'E') minR = Math.max(MAP_MIN, doorIdx + 2);
    else minC = Math.max(MAP_MIN, doorIdx + 2);
    const R = minR + Math.floor(Math.random() * Math.max(0, MAP_MAX - minR + 1));
    const C = minC + Math.floor(Math.random() * Math.max(0, MAP_MAX - minC + 1));
    return { R, C };
  }

  private findComponents(grid: MapGrid, R: number, C: number): Position[][] {
    const visited = Array.from({ length: R }, () => new Array(C).fill(false));
    const components: Position[][] = [];
    for (let sr = 0; sr < R; sr++) {
      for (let sc = 0; sc < C; sc++) {
        if (grid[sr][sc] === WALL || visited[sr][sc]) continue;
        const comp: Position[] = [];
        const queue: Position[] = [{ r: sr, c: sc }];
        visited[sr][sc] = true;
        while (queue.length) {
          const { r, c } = queue.shift()!;
          comp.push({ r, c });
          for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
            const nr = r+dr, nc = c+dc;
            if (nr>=0 && nr<R && nc>=0 && nc<C && !visited[nr][nc] && grid[nr][nc]!==WALL) {
              visited[nr][nc] = true;
              queue.push({ r: nr, c: nc });
            }
          }
        }
        components.push(comp);
      }
    }
    return components;
  }

  private carvePath(grid: MapGrid, r1: number, c1: number, r2: number, c2: number): void {
    let r = r1, c = c1;
    while (c !== c2) { if (grid[r][c] === WALL) grid[r][c] = EMPTY; c += c2 > c ? 1 : -1; }
    while (r !== r2) { if (grid[r][c] === WALL) grid[r][c] = EMPTY; r += r2 > r ? 1 : -1; }
    if (grid[r2][c2] === WALL) grid[r2][c2] = EMPTY;
  }

  garantisciConnettivita(grid: MapGrid, R: number, C: number): void {
    while (true) {
      const comps = this.findComponents(grid, R, C);
      if (comps.length <= 1) break;
      const intern = (comp: Position[]) => comp.filter(p => p.r>0 && p.r<R-1 && p.c>0 && p.c<C-1);
      const c0 = intern(comps[0]).length ? intern(comps[0]) : comps[0];
      let bestDist = Infinity, p1 = c0[0], p2 = comps[1][0];
      for (let ci = 1; ci < comps.length; ci++) {
        const ci_int = intern(comps[ci]).length ? intern(comps[ci]) : comps[ci];
        for (const a of c0) for (const b of ci_int) {
          const d = Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
          if (d < bestDist) { bestDist = d; p1 = a; p2 = b; }
        }
      }
      this.carvePath(grid, p1.r, p1.c, p2.r, p2.c);
    }
  }
}