import { create } from "zustand";

export const useGameStore = create((set) => ({
  player: { x: 200, y: 500 },
  movePlayer: (deltaX, deltaY) => {
    console.log("🔥 movePlayer вызван! Двигаем на:", deltaX, deltaY);
    
    set((state) => {
      const newX = Math.max(0, Math.min(375, state.player.x + deltaX));
      const newY = Math.max(0, Math.min(667, state.player.y + deltaY));

      console.log("🎯 Новая позиция персонажа:", newX, newY);

      return { player: { x: newX, y: newY } };
    });
  }
}));
