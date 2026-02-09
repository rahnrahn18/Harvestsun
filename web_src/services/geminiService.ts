import { GoogleGenAI } from "@google/genai";
import { GameState, Player } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMayorDialogue = async (
  player: Player,
  gameState: GameState,
  recentAction: string
): Promise<string> => {
  try {
    const prompt = `
      You are Mayor Thomas of Harvest Valley, a wise and cheerful old owl.
      The player is a new farmer.
      Current Game State:
      - Day: ${gameState.day}
      - Weather: ${gameState.weather}
      - Money: ${player.money} G
      - Energy: ${player.energy}/${player.maxEnergy}
      - Recent Action: ${recentAction}

      Give a helpful, very brief (max 2 sentences) tip or comment relative to the game state.
      If energy is low, suggest sleep. If money is high, suggest buying seeds. If it's rainy, mention the rain.
      Keep it immersive and RPG-like.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Hoo hoo! Welcome to the valley! Don't forget to water your crops!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hoo hoo! The spirits are quiet today. (Check API Key)";
  }
};
