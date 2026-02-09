import React from 'react';
import { Player, InventoryItem } from '../types';

interface InventoryBarProps {
  player: Player;
  onSelect: (index: number) => void;
}

const InventoryBar: React.FC<InventoryBarProps> = ({ player, onSelect }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-stone-800 p-2 rounded-2xl border-4 border-stone-600 shadow-2xl flex space-x-2">
      {player.inventory.map((item, index) => (
        <button
          key={`${item.id}-${index}`}
          onClick={() => onSelect(index)}
          className={`
            relative w-14 h-14 flex items-center justify-center text-3xl rounded-lg transition-transform hover:scale-105 active:scale-95
            ${player.selectedItemIndex === index ? 'bg-amber-200 ring-4 ring-amber-500 z-10 -translate-y-2' : 'bg-stone-700 hover:bg-stone-600'}
          `}
        >
          {item.icon}
          {item.count > -1 && (
            <span className="absolute bottom-0 right-1 text-xs font-bold text-white drop-shadow-md font-mono">
              {item.count}
            </span>
          )}
          
          {/* Tooltip on hover (desktop only roughly) */}
          <span className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default InventoryBar;