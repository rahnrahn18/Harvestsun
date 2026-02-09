export enum ToolType {
  HOE = 'HOE',
  WATERING_CAN = 'WATERING_CAN',
  SEEDS_TURNIP = 'SEEDS_TURNIP',
  SEEDS_CORN = 'SEEDS_CORN',
  HAND = 'HAND',
  SCYTHE = 'SCYTHE'
}

export enum TileType {
  GRASS = 'GRASS',
  DIRT = 'DIRT',
  WATER = 'WATER',
  HOUSE = 'HOUSE',
  SHOP = 'SHOP',
  MAYOR = 'MAYOR'
}

export enum CropState {
  SEED = 0,
  SPROUT = 1,
  GROWING = 2,
  RIPE = 3,
  DEAD = 4
}

export interface Crop {
  type: 'TURNIP' | 'CORN';
  state: CropState;
  daysPlanted: number;
  daysWatered: number;
}

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  isWatered: boolean;
  isTilled: boolean;
  crop: Crop | null;
}

export interface Player {
  x: number;
  y: number;
  facing: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  money: number;
  energy: number;
  maxEnergy: number;
  inventory: InventoryItem[];
  selectedItemIndex: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: ToolType;
  count: number; // -1 for infinite tools
  icon: string;
  buyPrice?: number;
  sellPrice?: number;
}

export interface GameState {
  day: number;
  time: number; // 0 to 2400
  weather: 'SUNNY' | 'RAINY';
}
