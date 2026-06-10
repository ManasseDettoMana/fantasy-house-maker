export const EMPTY  = 1;
export const WALL   = 2;
export const GOBLIN = 3;
export const POTION = 4;
export const DOOR   = 5;

export const MAX_LP  = 100;
export const MAP_MIN = 8;
export const MAP_MAX = 10;

export type CellType = typeof EMPTY | typeof WALL | typeof GOBLIN | typeof POTION | typeof DOOR;

export type MapGrid = CellType[][];

export type Side = 'N' | 'S' | 'E' | 'W';

export interface Position {
  r: number;
  c: number;
}

export interface StoredMap {
  grid: MapGrid;
}

export interface Connection {
  mapId: number;
  side: Side;
  idx: number;
}

export type GamePhase = 'exploring' | 'battle' | 'dead' | 'victory';

export interface BattleState {
  enemyLp: number;
  playerLp: number;
  log: string[];
}