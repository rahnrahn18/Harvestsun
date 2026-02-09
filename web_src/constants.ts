import { InventoryItem, ToolType } from './types';

export const GRID_WIDTH = 15;
export const GRID_HEIGHT = 10;
export const CELL_SIZE = 48; // px

export const INITIAL_ENERGY = 100;
export const ENERGY_COST_ACTION = 2;
export const ENERGY_COST_MOVE = 0;

export const INITIAL_MONEY = 200;

export const STARTING_INVENTORY: InventoryItem[] = [
  { id: 'hoe', name: 'Hoe', type: ToolType.HOE, count: -1, icon: '⛏️' },
  { id: 'water', name: 'Water Can', type: ToolType.WATERING_CAN, count: -1, icon: '💧' },
  { id: 'scythe', name: 'Scythe', type: ToolType.SCYTHE, count: -1, icon: '⚔️' },
  { id: 'seed_turnip', name: 'Turnip Seeds', type: ToolType.SEEDS_TURNIP, count: 5, icon: '🌰', buyPrice: 20, sellPrice: 0 },
];

export const SHOP_ITEMS: InventoryItem[] = [
  { id: 'seed_turnip', name: 'Turnip Seeds', type: ToolType.SEEDS_TURNIP, count: 1, icon: '🌰', buyPrice: 20 },
  { id: 'seed_corn', name: 'Corn Seeds', type: ToolType.SEEDS_CORN, count: 1, icon: '🌽', buyPrice: 50 },
];

export const CROP_DATA = {
  TURNIP: {
    name: 'Turnip',
    growthDays: 3,
    sellPrice: 60,
    icon: {
      [0]: '🌰',
      [1]: '🌱',
      [2]: '🌿',
      [3]: '🥕', // Turnip emoji substitute
      [4]: '🥀'
    }
  },
  CORN: {
    name: 'Corn',
    growthDays: 5,
    sellPrice: 150,
    icon: {
      [0]: '🌰',
      [1]: '🌱',
      [2]: '🌿',
      [3]: '🌽',
      [4]: '🥀'
    }
  }
};
