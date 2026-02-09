import React from 'react';
import { Tile, TileType, Player, CropState } from '../types';
import { CROP_DATA } from '../constants';
import { User, Store, Landmark } from 'lucide-react';

interface GameGridProps {
  grid: Tile[][];
  player: Player;
}

const GameGrid: React.FC<GameGridProps> = ({ grid, player }) => {
  return (
    <div className="relative shadow-2xl border-4 border-stone-800 rounded-lg overflow-hidden bg-stone-900 select-none">
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((tile, x) => (
            <GridCell key={`${x}-${y}`} tile={tile} />
          ))}
        </div>
      ))}
      
      {/* Player Rendering Overlay */}
      <div 
        className="absolute transition-all duration-200 pointer-events-none flex items-center justify-center text-4xl"
        style={{
          top: player.y * 48,
          left: player.x * 48,
          width: 48,
          height: 48,
          zIndex: 20
        }}
      >
        <span className="drop-shadow-md filter">🧑‍🌾</span>
      </div>

       {/* Selection Highlight */}
       <div 
        className="absolute border-2 border-yellow-400 opacity-60 pointer-events-none transition-all duration-100 animate-pulse"
        style={{
          top: getTargetY(player) * 48,
          left: getTargetX(player) * 48,
          width: 48,
          height: 48,
          zIndex: 15
        }}
      />
    </div>
  );
};

const GridCell: React.FC<{ tile: Tile }> = ({ tile }) => {
  let bgClass = "bg-green-600"; // Default Grass
  let content = null;

  switch (tile.type) {
    case TileType.DIRT:
      bgClass = tile.isWatered ? "bg-amber-900" : "bg-amber-700"; // Darker if wet
      break;
    case TileType.WATER:
      bgClass = "bg-blue-500";
      break;
    case TileType.HOUSE:
      bgClass = "bg-stone-700";
      content = <span className="text-2xl">🏠</span>;
      break;
    case TileType.SHOP:
      bgClass = "bg-purple-800";
      content = <Store className="text-white w-6 h-6" />;
      break;
     case TileType.MAYOR:
      bgClass = "bg-red-800";
      content = <Landmark className="text-white w-6 h-6" />;
      break;
  }

  // Render Crop
  if (tile.crop) {
    const cropDef = CROP_DATA[tile.crop.type];
    const icon = cropDef.icon[tile.crop.state as keyof typeof cropDef.icon];
    content = <span className="text-2xl animate-bounce-slight">{icon}</span>;
  }

  return (
    <div 
      className={`w-12 h-12 flex items-center justify-center border-stone-900/10 border ${bgClass} relative`}
    >
      {content}
      {tile.type === TileType.DIRT && tile.isTilled && !tile.crop && (
        <div className="absolute w-8 h-8 rounded-full bg-black/10"></div>
      )}
    </div>
  );
};

// Helper to calculate highlight box
const getTargetX = (p: Player) => {
  if (p.facing === 'LEFT') return p.x - 1;
  if (p.facing === 'RIGHT') return p.x + 1;
  return p.x;
};
const getTargetY = (p: Player) => {
  if (p.facing === 'UP') return p.y - 1;
  if (p.facing === 'DOWN') return p.y + 1;
  return p.y;
};

export default GameGrid;