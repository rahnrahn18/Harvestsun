import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_WIDTH, GRID_HEIGHT, INITIAL_ENERGY, INITIAL_MONEY, STARTING_INVENTORY, ENERGY_COST_ACTION, CROP_DATA } from './constants';
import { Tile, TileType, Player, GameState, ToolType, InventoryItem, CropState } from './types';
import GameGrid from './components/GameGrid';
import HUD from './components/HUD';
import InventoryBar from './components/InventoryBar';
import ShopModal from './components/ShopModal';
import MayorChat from './components/MayorChat';
import { BedDouble, Sparkles } from 'lucide-react';

// Initial Grid Generation
const generateGrid = (): Tile[][] => {
  const grid: Tile[][] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      let type = TileType.GRASS;
      // Simple map generation
      if (x === 0 || x === GRID_WIDTH - 1 || y === 0 || y === GRID_HEIGHT - 1) type = TileType.GRASS; // Borders
      else if (x === 2 && y === 2) type = TileType.HOUSE;
      else if (x === 12 && y === 2) type = TileType.SHOP;
      else if (x === 7 && y === 2) type = TileType.MAYOR; // Town square
      else if (x > 10 && y > 6) type = TileType.WATER; // Pond
      
      row.push({
        x, y, type,
        isWatered: false,
        isTilled: false,
        crop: null
      });
    }
    grid.push(row);
  }
  return grid;
};

const App: React.FC = () => {
  // --- State ---
  const [grid, setGrid] = useState<Tile[][]>(generateGrid());
  const [player, setPlayer] = useState<Player>({
    x: 7, y: 5,
    facing: 'DOWN',
    money: INITIAL_MONEY,
    energy: INITIAL_ENERGY,
    maxEnergy: 100,
    inventory: [...STARTING_INVENTORY],
    selectedItemIndex: 0
  });
  const [gameState, setGameState] = useState<GameState>({
    day: 1,
    time: 600, // 06:00 AM
    weather: 'SUNNY'
  });
  
  // UI States
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMayorChatOpen, setIsMayorChatOpen] = useState(false);
  const [recentAction, setRecentAction] = useState<string>("Just started the day.");
  const [messageLog, setMessageLog] = useState<string[]>(["Welcome to Harvest Valley!"]);

  // Refs for handling key repeats efficiently
  const lastActionTime = useRef(0);

  // --- Helpers ---
  const logMessage = (msg: string) => {
    setMessageLog(prev => [msg, ...prev].slice(0, 5));
    setRecentAction(msg);
  };

  const getTargetTile = (): { x: number, y: number } | null => {
    let tx = player.x;
    let ty = player.y;
    if (player.facing === 'UP') ty--;
    if (player.facing === 'DOWN') ty++;
    if (player.facing === 'LEFT') tx--;
    if (player.facing === 'RIGHT') tx++;
    
    if (tx < 0 || tx >= GRID_WIDTH || ty < 0 || ty >= GRID_HEIGHT) return null;
    return { x: tx, y: ty };
  };

  // --- Actions ---
  const handleMove = (dx: number, dy: number) => {
    if (isShopOpen || isMayorChatOpen) return;

    setPlayer(prev => {
      let newFacing = prev.facing;
      if (dx === 1) newFacing = 'RIGHT';
      if (dx === -1) newFacing = 'LEFT';
      if (dy === 1) newFacing = 'DOWN';
      if (dy === -1) newFacing = 'UP';

      const nx = prev.x + dx;
      const ny = prev.y + dy;

      // Collision Check
      if (nx < 0 || nx >= GRID_WIDTH || ny < 0 || ny >= GRID_HEIGHT) return { ...prev, facing: newFacing };
      
      const targetTile = grid[ny][nx];
      if (targetTile.type === TileType.WATER || targetTile.type === TileType.HOUSE || targetTile.type === TileType.SHOP || targetTile.type === TileType.MAYOR) {
        return { ...prev, facing: newFacing };
      }

      return { ...prev, x: nx, y: ny, facing: newFacing };
    });
  };

  const handleInteract = () => {
    if (isShopOpen || isMayorChatOpen) return;

    const target = getTargetTile();
    if (!target) return;
    const tile = grid[target.y][target.x];

    // Interaction 1: Special Buildings
    if (tile.type === TileType.SHOP) {
      setIsShopOpen(true);
      return;
    }
    if (tile.type === TileType.MAYOR) {
      setIsMayorChatOpen(true);
      return;
    }
    if (tile.type === TileType.HOUSE) {
      logMessage("Home sweet home. Press 'Sleep' button to rest.");
      return;
    }

    // Interaction 2: Harvesting (Hand or Scythe)
    if (tile.crop && tile.crop.state === CropState.RIPE) {
        const cropInfo = CROP_DATA[tile.crop.type];
        setGrid(prev => {
            const newGrid = [...prev];
            newGrid[target.y] = [...prev[target.y]];
            newGrid[target.y][target.x] = { ...tile, crop: null, isTilled: true }; // Soil remains tilled
            return newGrid;
        });
        setPlayer(prev => ({ ...prev, money: prev.money + cropInfo.sellPrice }));
        logMessage(`Harvested ${cropInfo.name}! Sold for ${cropInfo.sellPrice}G.`);
        // Spawn particle effect logic could go here
        return;
    }

    // Interaction 3: Using Tools
    useTool(target.x, target.y, tile);
  };

  const useTool = (tx: number, ty: number, tile: Tile) => {
    const selectedItem = player.inventory[player.selectedItemIndex];
    if (!selectedItem) return;

    if (player.energy < ENERGY_COST_ACTION) {
      logMessage("Too tired!");
      return;
    }

    let actionSuccess = false;

    // --- HOE ---
    if (selectedItem.type === ToolType.HOE) {
      if (tile.type === TileType.GRASS) {
        setGrid(prev => updateTile(prev, tx, ty, { type: TileType.DIRT, isTilled: true }));
        actionSuccess = true;
      } else if (tile.type === TileType.DIRT && !tile.isTilled && !tile.crop) {
        setGrid(prev => updateTile(prev, tx, ty, { isTilled: true }));
        actionSuccess = true;
      }
    }
    // --- WATERING CAN ---
    else if (selectedItem.type === ToolType.WATERING_CAN) {
        // Can refill at water?
        if (tile.type === TileType.WATER) {
             logMessage("Watering can refilled!");
             // Simplify: Infinite water for prototype
             return;
        }

        if (tile.type === TileType.DIRT && tile.isTilled) {
            setGrid(prev => updateTile(prev, tx, ty, { isWatered: true }));
            actionSuccess = true;
        }
    }
    // --- SEEDS ---
    else if (selectedItem.type === ToolType.SEEDS_TURNIP || selectedItem.type === ToolType.SEEDS_CORN) {
        if (tile.type === TileType.DIRT && tile.isTilled && !tile.crop) {
            const cropType = selectedItem.type === ToolType.SEEDS_TURNIP ? 'TURNIP' : 'CORN';
            setGrid(prev => updateTile(prev, tx, ty, { 
                crop: { type: cropType, state: CropState.SEED, daysPlanted: 0, daysWatered: 0 } 
            }));
            
            // Remove seed from inventory
            setPlayer(prev => {
                const newInv = [...prev.inventory];
                if (newInv[prev.selectedItemIndex].count > 0) {
                    newInv[prev.selectedItemIndex].count--;
                    if (newInv[prev.selectedItemIndex].count === 0) {
                        newInv.splice(prev.selectedItemIndex, 1);
                        // Safe index fallback
                        return { ...prev, inventory: newInv, selectedItemIndex: Math.max(0, prev.selectedItemIndex - 1), energy: prev.energy - ENERGY_COST_ACTION };
                    }
                }
                return { ...prev, inventory: newInv, energy: prev.energy - ENERGY_COST_ACTION };
            });
            actionSuccess = true; // Handled energy in setPlayer above specifically for inventory logic
            return; 
        }
    }
    // --- SCYTHE ---
    else if (selectedItem.type === ToolType.SCYTHE) {
        if (tile.crop && tile.crop.state === CropState.DEAD) {
            setGrid(prev => updateTile(prev, tx, ty, { crop: null }));
            actionSuccess = true;
        }
    }

    if (actionSuccess) {
        setPlayer(prev => ({ ...prev, energy: prev.energy - ENERGY_COST_ACTION }));
    }
  };

  const updateTile = (grid: Tile[][], x: number, y: number, updates: Partial<Tile>) => {
    const newGrid = [...grid];
    newGrid[y] = [...grid[y]];
    newGrid[y][x] = { ...newGrid[y][x], ...updates };
    return newGrid;
  };

  // --- Game Loop / Day Cycle ---
  const sleep = () => {
    // Advance Day
    setGameState(prev => ({
        day: prev.day + 1,
        time: 600,
        weather: Math.random() > 0.8 ? 'RAINY' : 'SUNNY'
    }));

    // Restore Energy
    setPlayer(prev => ({ ...prev, energy: prev.maxEnergy }));
    
    // Grow Crops
    setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => row.map(tile => {
            const newTile = { ...tile };
            
            // Logic: Needs water to grow
            if (newTile.crop) {
                const cropDef = CROP_DATA[newTile.crop.type];
                
                // If it was watered yesterday or it rained
                if (newTile.isWatered || gameState.weather === 'RAINY') {
                    newTile.crop.daysWatered++;
                    
                    // Growth logic based on days watered
                    const progress = newTile.crop.daysWatered / cropDef.growthDays;
                    if (progress >= 1) newTile.crop.state = CropState.RIPE;
                    else if (progress >= 0.66) newTile.crop.state = CropState.GROWING;
                    else if (progress >= 0.33) newTile.crop.state = CropState.SPROUT;
                }
            }

            // Reset soil water for new day (unless it's raining today? No, soil dries)
            // But wait, we just set weather for the NEW day. 
            // Soil logic: Dry out every morning.
            newTile.isWatered = false; 

            return newTile;
        }));
        return newGrid;
    });

    logMessage("You slept well. A new day begins!");
  };

  // --- Shop Logic ---
  const handleBuy = (item: InventoryItem) => {
    if (player.money >= (item.buyPrice || 0)) {
        setPlayer(prev => {
            // Check if item exists in inventory to stack
            const existingIdx = prev.inventory.findIndex(i => i.id === item.id);
            let newInv = [...prev.inventory];
            
            if (existingIdx >= 0) {
                newInv[existingIdx] = { ...newInv[existingIdx], count: newInv[existingIdx].count + 1 };
            } else {
                newInv.push({ ...item, count: 1 });
            }
            return {
                ...prev,
                money: prev.money - (item.buyPrice || 0),
                inventory: newInv
            };
        });
        logMessage(`Bought ${item.name}`);
    }
  };

  // --- Input Handling ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent default scrolling for arrows/space
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }

        const now = Date.now();
        if (now - lastActionTime.current < 100) return; // Debounce slightly
        lastActionTime.current = now;

        switch (e.key) {
            case 'ArrowUp': handleMove(0, -1); break;
            case 'ArrowDown': handleMove(0, 1); break;
            case 'ArrowLeft': handleMove(-1, 0); break;
            case 'ArrowRight': handleMove(1, 0); break;
            case ' ': handleInteract(); break;
            case 'e': 
                setPlayer(p => ({ ...p, selectedItemIndex: (p.selectedItemIndex + 1) % p.inventory.length }));
                break;
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, grid, isShopOpen, isMayorChatOpen, gameState]); // Deps are important here

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4 text-stone-100 font-vt323 relative">
      
      <h1 className="text-4xl text-amber-400 mb-2 drop-shadow-md tracking-wider">HARVEST VALLEY</h1>
      
      <HUD player={player} gameState={gameState} />

      {/* Main Game Area */}
      <div className="relative">
          <GameGrid grid={grid} player={player} />
          
          {/* Action Log Overlay */}
          <div className="absolute top-2 left-2 bg-black/50 p-2 rounded text-sm pointer-events-none w-48 h-24 overflow-hidden flex flex-col justify-end">
             {messageLog.map((msg, i) => (
                 <div key={i} className={`opacity-${100 - i * 20} text-shadow-sm text-white`}>
                     {msg}
                 </div>
             ))}
          </div>
      </div>

      <InventoryBar 
        player={player} 
        onSelect={(idx) => setPlayer(prev => ({ ...prev, selectedItemIndex: idx }))} 
      />

      {/* Controls Help */}
      <div className="mt-20 text-stone-500 text-sm flex gap-4">
         <span>ARROWS: Move</span>
         <span>SPACE: Interact/Use</span>
         <span>E: Cycle Tools</span>
      </div>

      {/* Floating Action Button for Sleep */}
      <button 
        onClick={sleep}
        className="fixed top-4 right-4 bg-indigo-900 hover:bg-indigo-800 text-white p-3 rounded-full shadow-xl border-2 border-indigo-400 z-30 flex items-center gap-2 group transition-all"
        title="Sleep (Next Day)"
      >
        <BedDouble />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">Sleep</span>
      </button>

      {/* Modals */}
      <ShopModal 
        isOpen={isShopOpen} 
        onClose={() => setIsShopOpen(false)} 
        player={player}
        onBuy={handleBuy}
      />

      <MayorChat 
        isOpen={isMayorChatOpen}
        onClose={() => setIsMayorChatOpen(false)}
        player={player}
        gameState={gameState}
        recentAction={recentAction}
      />
    </div>
  );
};

export default App;