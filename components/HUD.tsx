import React from 'react';
import { Player, GameState } from '../types';
import { Sun, CloudRain, Battery, Coins, Calendar } from 'lucide-react';

interface HUDProps {
  player: Player;
  gameState: GameState;
}

const HUD: React.FC<HUDProps> = ({ player, gameState }) => {
  return (
    <div className="w-full max-w-2xl flex items-center justify-between bg-stone-800 text-amber-50 p-3 rounded-xl border-2 border-stone-600 shadow-lg mb-4">
      
      {/* Date & Time */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-amber-300" />
            <span className="text-xl">Day {gameState.day}</span>
        </div>
        <div className="flex items-center space-x-2">
            {gameState.weather === 'SUNNY' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
                <CloudRain className="w-5 h-5 text-blue-400" />
            )}
            <span className="text-lg tracking-widest">{gameState.weather}</span>
        </div>
      </div>

      {/* Resources */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-bold">{player.money} G</span>
        </div>
        <div className="flex items-center space-x-2">
            <Battery className={`w-5 h-5 ${player.energy < 20 ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
            <div className="flex flex-col w-24">
                <span className="text-xs uppercase text-stone-400">Energy</span>
                <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${player.energy < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${(player.energy / player.maxEnergy) * 100}%` }}
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HUD;