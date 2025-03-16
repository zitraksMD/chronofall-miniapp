import { create } from "zustand";
import { useGameStore } from "./gameStore";

export const useEnemiesStore = create((set, get) => ({
  enemies: [],
  waveNumber: 1,

  // ✅ СПАВН ВРАГОВ
  spawnEnemy: () => {
    const { waveNumber, enemies } = get();
    if (enemies.length > 0) return; // Если враги уже есть, не спавним

    console.log(`🔥 Спавним волну ${waveNumber}`);

    const newEnemies = [];
    const enemyCount = waveNumber * 3; // Количество врагов увеличивается

    for (let i = 0; i < enemyCount; i++) {
      let x, y;
      const side = Math.floor(Math.random() * 4);

      if (side === 0) { // Враги сверху
        x = Math.random() * 375;
        y = -40;
      } else if (side === 1) { // Враги снизу
        x = Math.random() * 375;
        y = 667 + 40;
      } else if (side === 2) { // Враги слева
        x = -40;
        y = Math.random() * 667;
      } else { // Враги справа
        x = 375 + 40;
        y = Math.random() * 667;
      }

      newEnemies.push({ x, y, speed: 2, id: Math.random() });
    }

    set({ enemies: newEnemies });
  },
  removeEnemy: (id) => {
    set((state) => ({
      enemies: state.enemies.filter((enemy) => enemy.id !== id),
    }));
  },

  resetWave: () => {
    set({ enemies: [] });
  },

  // ✅ ОБНОВЛЕНИЕ ВРАГОВ (ИДУТ К ПЕРСОНАЖУ)
  updateEnemies: () => {
    set((state) => ({
      enemies: state.enemies.map((enemy) => {
        const player = useGameStore.getState().player;
        if (!player) return enemy;

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return {
          ...enemy,
          x: enemy.x + (dx / distance) * enemy.speed,
          y: enemy.y + (dy / distance) * enemy.speed,
        };
      }),
    }));
  },

  // ✅ УДАЛЕНИЕ ВРАГА + СПАВН НОВОЙ ВОЛНЫ
  removeEnemy: (id) => {
    set((state) => {
      const updatedEnemies = state.enemies.filter((enemy) => enemy.id !== id);
      
      // ✅ Если всех убили, запускаем новую волну
      if (updatedEnemies.length === 0) {
        console.log("✅ Все враги убиты! Запускаем следующую волну...");
        set({ waveNumber: state.waveNumber + 1 });

        setTimeout(() => {
          get().spawnEnemy();
        }, 2000);
      }

      return { enemies: updatedEnemies };
    });
  },
}));

// ✅ СПАВНИМ ПЕРВУЮ ВОЛНУ ПРИ СТАРТЕ ИГРЫ
setTimeout(() => {
  useEnemiesStore.getState().spawnEnemy();
}, 1000); // Запуск через 1 секунду
