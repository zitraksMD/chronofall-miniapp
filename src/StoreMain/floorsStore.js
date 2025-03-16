import { create } from "zustand";

const DEATH_THRESHOLD_VERTICAL = 700;
const JUMP_COOLDOWN = 200;
const GRAVITY = 0.3;
const MAX_FALL_SPEED = 6;
const BULLET_SPEED = 10;

const INITIAL_PLAYER_STATE = {
  x: 50,
  y: 510 - 40,
  isJumping: false,
  velocityY: 0,
  jumpCount: 0,
  allowedJumps: 2,
  lastJumpTime: 0,
  direction: 1, // 1 - вправо, -1 - влево
};

export const useFloorsStore = create((set, get) => ({
  player: { ...INITIAL_PLAYER_STATE },
  bullets: [], // ✅ Всегда массив
  monsters: [
    { x: 300, y: 510, width: 40, height: 40, direction: 1, speed: 2, patrolLeft: 250, patrolRight: 350 },
    { x: 900, y: 410, width: 40, height: 40, direction: -1, speed: 2, patrolLeft: 850, patrolRight: 1000 },
  ],
  floors: [
    { x: 0, y: 550, width: 800, height: 20 },
    { x: 850, y: 450, width: 500, height: 20 },
  ],

  fireBullet: () => {
    set((state) => {
      const { x, y, direction } = state.player;

      const newBullet = {
        x: x + (direction === 1 ? 25 : -5),
        y: y + 20,
        width: 10,
        height: 5,
        direction,
        speed: BULLET_SPEED,
      };

      return { bullets: [...state.bullets, newBullet] };
    });
  },

  // ✅ Переименовал с "mmoveBullets" на "moveBullets"
  moveBullets: () => {
    set((state) => {
      if (!state.bullets) return { bullets: [] }; // ✅ Гарантия, что bullets — массив

      let updatedMonsters = [...state.monsters];

      const newBullets = state.bullets.filter((bullet) => {
        bullet.x += bullet.direction * bullet.speed;

        let hitMonsterIndex = updatedMonsters.findIndex(
          (monster) =>
            bullet.x < monster.x + monster.width &&
            bullet.x + bullet.width > monster.x &&
            bullet.y < monster.y + monster.height &&
            bullet.y + bullet.height > monster.y
        );

        if (hitMonsterIndex !== -1) {
          updatedMonsters.splice(hitMonsterIndex, 1);
          return false;
        }

        const hitPlatform = state.floors.some(
          (floor) =>
            bullet.x < floor.x + floor.width &&
            bullet.x + bullet.width > floor.x &&
            bullet.y + bullet.height >= floor.y &&
            bullet.y <= floor.y + floor.height
        );

        if (hitPlatform) return false;

        if (bullet.x < 0 || bullet.x > 1300) return false;

        return true;
      });

      return { bullets: newBullets, monsters: updatedMonsters };
    });
  },
  

  moveMonsters: () => {
    set((state) => {
      const updatedMonsters = state.monsters.map((monster) => {
        let newX = monster.x + monster.direction * monster.speed;
        if (newX < monster.patrolLeft || newX > monster.patrolRight) {
          return { ...monster, direction: -monster.direction };
        }
        return { ...monster, x: newX };
      });

      return { monsters: updatedMonsters };
    });
  },

  movePlayer: (deltaX) =>
    set((state) => {
      const newX = Math.max(0, Math.min(1300, state.player.x + deltaX));
      return { player: { ...state.player, x: newX, direction: deltaX > 0 ? 1 : -1 } };
    }),

  jump: () =>
    set((state) => {
      const now = Date.now();
      if (now - state.player.lastJumpTime < JUMP_COOLDOWN) return {};

      if (state.player.jumpCount < state.player.allowedJumps) {
        return {
          player: {
            ...state.player,
            velocityY: state.player.jumpCount === 0 ? -10 : -7,
            isJumping: true,
            jumpCount: state.player.jumpCount + 1,
            lastJumpTime: now,
          },
        };
      }

      return {};
    }),

  applyGravity: () =>
    set((state) => {
      let { y, velocityY, jumpCount } = state.player;
      velocityY += GRAVITY;
      if (velocityY > MAX_FALL_SPEED) velocityY = MAX_FALL_SPEED;
      let newY = y + velocityY;

      let isOnGround = false;
      state.floors.forEach((floor) => {
        if (
          velocityY >= 0 &&
          state.player.x + 20 >= floor.x &&
          state.player.x - 20 <= floor.x + floor.width &&
          y + 40 <= floor.y &&
          newY + 40 >= floor.y
        ) {
          newY = floor.y - 40;
          velocityY = 0;
          isOnGround = true;
        }
      });

      state.monsters.forEach((monster) => {
        if (
          state.player.x + 20 > monster.x &&
          state.player.x - 20 < monster.x + monster.width &&
          state.player.y + 40 > monster.y &&
          state.player.y < monster.y + monster.height
        ) {
          alert("💀 Вы умерли от монстра!");
          set({ player: { ...INITIAL_PLAYER_STATE } });
        }
      });

      if (newY > DEATH_THRESHOLD_VERTICAL) {
        alert("💀 Вы умерли!");
        return { player: { ...INITIAL_PLAYER_STATE } };
      }

      return {
        player: { ...state.player, y: newY, velocityY, isJumping: !isOnGround, jumpCount: isOnGround ? 0 : jumpCount },
      };
    }),

  checkExit: () =>
    set((state) => {
      if (!state || !state.player || !state.exitDoor) return {};
      if (
        state.player.x >= state.exitDoor.x &&
        state.player.x <= state.exitDoor.x + state.exitDoor.width &&
        state.player.y + 40 >= state.exitDoor.y
      ) {
        setTimeout(() => alert("🎉 Уровень завершён!"), 200);
      }
      return {};
    }),
}));
