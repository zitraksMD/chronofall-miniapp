import { create } from "zustand";
import { useEnemiesStore } from "./enemiesStore";
import { useGameStore } from "./gameStore";

export const useBulletsStore = create((set, get) => ({
  bullets: [],
  lastShotTime: 0,

  shoot: () => {
    const { enemies } = useEnemiesStore.getState();
    if (enemies.length === 0) return; // Не стреляем, если врагов нет

    const currentTime = Date.now();
    if (currentTime - get().lastShotTime < 1000) return; // Ограничение по времени

    const player = useGameStore.getState().player;
    const target = enemies.reduce((closest, enemy) => {
      const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      return !closest || distance < closest.distance ? { enemy, distance } : closest;
    }, null);

    if (!target) return;

    set((state) => {
      const bulletSpeed = 50;
      const dx = target.enemy.x - player.x;
      const dy = target.enemy.y - player.y;
      const distance = Math.hypot(dx, dy);

      const newBullet = {
        x: player.x,
        y: player.y,
        vx: (dx / distance) * bulletSpeed,
        vy: (dy / distance) * bulletSpeed,
        id: Math.random(),
      };

      console.log("🔥 Выстрел!");

      return { bullets: [...state.bullets, newBullet], lastShotTime: currentTime };
    });
  },

  updateBullets: () => {
    set((state) => {
      const { enemies, removeEnemy } = useEnemiesStore.getState();
      return {
        bullets: state.bullets
          .map((bullet) => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;

            enemies.forEach((enemy) => {
              if (
                bullet.x < enemy.x + 40 &&
                bullet.x + 20 > enemy.x &&
                bullet.y < enemy.y + 40 &&
                bullet.y + 40 > enemy.y
              ) {
                removeEnemy(enemy.id);
              }
            });

            return bullet;
          })
          .filter((bullet) => bullet.x > 0 && bullet.x < 375 && bullet.y > 0 && bullet.y < 667),
      };
    });
  },
}));
