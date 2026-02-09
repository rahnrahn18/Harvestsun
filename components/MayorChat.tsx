import React, { useState, useEffect } from 'react';
import { getMayorDialogue } from '../services/geminiService';
import { Player, GameState } from '../types';
import { MessageCircle, X } from 'lucide-react';

interface MayorChatProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
  gameState: GameState;
  recentAction: string;
}

const MayorChat: React.FC<MayorChatProps> = ({ isOpen, onClose, player, gameState, recentAction }) => {
  const [text, setText] = useState<string>("Loading thoughts...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setText("Hmm, let me see...");
      getMayorDialogue(player, gameState, recentAction)
        .then((response) => {
          setText(response);
          setLoading(false);
        })
        .catch(() => {
            setText("My mind is wandering... try again later.");
            setLoading(false);
        });
    }
  }, [isOpen, player.money, gameState.day, recentAction]); // Re-fetch on significant changes if reopened or props change

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 md:right-20 z-40 max-w-sm animate-fade-in-up">
        <div className="bg-white border-4 border-stone-800 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl shadow-xl overflow-hidden relative">
            <div className="bg-red-800 text-white px-3 py-1 flex justify-between items-center">
                <span className="font-bold">Mayor Thomas</span>
                <button onClick={onClose}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex p-4 bg-stone-50">
                <div className="mr-3 text-4xl self-start pt-1">🦉</div>
                <div className="text-lg text-stone-800 leading-tight font-medium">
                   {loading ? <span className="animate-pulse">Thinking...</span> : text}
                </div>
            </div>
            <div className="h-1 bg-red-800 w-full"></div>
        </div>
        {/* Speech bubble tail */}
        <div className="absolute -bottom-2 right-0 w-4 h-4 bg-stone-800 rotate-45 transform origin-top-left"></div>
    </div>
  );
};

export default MayorChat;