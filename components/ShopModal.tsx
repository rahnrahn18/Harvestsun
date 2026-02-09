import React from 'react';
import { InventoryItem, Player } from '../types';
import { SHOP_ITEMS } from '../constants';
import { X } from 'lucide-react';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
  onBuy: (item: InventoryItem) => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose, player, onBuy }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-orange-100 w-full max-w-md rounded-xl border-4 border-amber-800 shadow-2xl overflow-hidden font-vt323">
        <div className="bg-amber-800 p-3 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold">General Store</h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        <div className="p-4 bg-orange-50">
          <div className="text-center mb-4 text-amber-900 text-xl">
             Your Money: <span className="font-bold">{player.money} G</span>
          </div>
          
          <div className="space-y-3">
            {SHOP_ITEMS.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                 <div className="flex items-center space-x-3">
                    <span className="text-3xl bg-amber-100 p-2 rounded">{item.icon}</span>
                    <div>
                        <div className="font-bold text-lg text-amber-900">{item.name}</div>
                        <div className="text-amber-700 text-sm">Price: {item.buyPrice} G</div>
                    </div>
                 </div>
                 <button
                    disabled={player.money < (item.buyPrice || 999)}
                    onClick={() => onBuy(item)}
                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-500 disabled:bg-stone-400 disabled:cursor-not-allowed"
                 >
                    Buy
                 </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-3 bg-amber-100 text-center text-amber-800 text-sm">
            "We have the best seeds in the valley!"
        </div>
      </div>
    </div>
  );
};

export default ShopModal;