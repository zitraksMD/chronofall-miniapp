import { create } from "zustand";

const DEATH_THRESHOLD_VERTICAL = 700; // Если y игрока больше 700, игрок умирает
const JUMP_COOLDOWN = 200; // Задержка в мс между прыжками

export const useFloorsStore = create((set, get) => {
  console.log("✅ useFloorsStore загружен!");

  return {
    // Начальное состояние игрока, включая jumpCount и lastJumpTime
    player: { x: 50, y: 500, isJumping: false, velocityY: 0, jumpCount: 0, allowedJumps: 2, lastJumpTime: 0 },
    
    floors: [
      { x: 0, y: 550, width: 800, height: 20 },
      { x: 850, y: 450, width: 500, height: 20 },
    ],
    
    ladders: [{ x: 400, y: 450, width: 40, height: 100 }],

    exitDoor: { x: 1200, y: 400, width: 50, height: 80 },

    movePlayer: (deltaX) =>
      set((state) => {
        if (!state || !state.player) {
          console.error("State или state.player не определены в movePlayer");
          return {};
        }
        console.log(`🔄 movePlayer вызван! Перемещение на ${deltaX}px`);
        const newX = Math.max(0, Math.min(1300, state.player.x + deltaX));
        return { player: { ...state.player, x: newX } };
      }),

    // Функция прыжка с задержкой между прыжками
    jump: () =>
      set((state) => {
        const now = Date.now();
        // Проверяем, прошло ли достаточно времени с последнего прыжка
        if (now - state.player.lastJumpTime < JUMP_COOLDOWN) {
          console.log("Прыжок слишком рано, ждём");
          return {};
        }
        if (state.player.jumpCount < state.player.allowedJumps) {
          const newVelocity = state.player.jumpCount === 0 ? -10 : -6;
          console.log("🆙 Прыжок! (jumpCount =", state.player.jumpCount + 1, ")");
          return {
            player: {
              ...state.player,
              velocityY: newVelocity,
              isJumping: true,
              jumpCount: state.player.jumpCount + 1,
              lastJumpTime: now, // Обновляем время прыжка
            },
          };
        }
        return {};
      }),

      applyGravity: () =>
        set((state) => {
          const GRAVITY = 0.4;      // уменьшенная гравитация
          const MAX_FALL_SPEED = 10; // ограничение максимальной скорости падения
      
          let { y, velocityY, jumpCount } = state.player;
          velocityY += GRAVITY;       // добавляем гравитацию
          // Ограничиваем скорость падения:
          if (velocityY > MAX_FALL_SPEED) velocityY = MAX_FALL_SPEED;
          let newY = y + velocityY;
      
          let isOnGround = false;
          const playerLeft = state.player.x - 20;
          const playerRight = state.player.x + 20;
          state.floors.forEach((floor) => {
            if (
              velocityY > 0 &&
              playerRight >= floor.x &&
              playerLeft <= floor.x + floor.width &&
              y + 40 <= floor.y &&
              newY + 40 >= floor.y
            ) {
              newY = floor.y - 40;
              velocityY = 0;
              isOnGround = true;
            }
          });
      
          if (newY > DEATH_THRESHOLD_VERTICAL) {
            alert("Вы умерли!");
            return {
              player: {
                x: 50,
                y: 500,
                isJumping: false,
                velocityY: 0,
                jumpCount: 0,
                allowedJumps: 2,
                lastJumpTime: 0,
              },
            };
          }
      
          if (isOnGround) {
            jumpCount = 0; // сбрасываем счётчик прыжков при приземлении
          }
      
          return {
            player: { ...state.player, y: newY, velocityY, isJumping: !isOnGround, jumpCount },
          };
        }),
      
      
      

    climbLadder: () =>
      set((state) => {
        const onLadder = state.ladders.some(
          (ladder) => 
            state.player.x >= ladder.x &&
            state.player.x <= ladder.x + ladder.width &&
            state.player.y + 40 >= ladder.y
        );
    
        if (onLadder) {
          return { player: { ...state.player, y: state.player.y - 5 } };
        }
        return {};
      }),

    checkExit: () =>
      set((state) => {
        if (
          state.player.x >= state.exitDoor.x &&
          state.player.x <= state.exitDoor.x + state.exitDoor.width &&
          state.player.y + 40 >= state.exitDoor.y
        ) {
          setTimeout(() => alert("🎉 Уровень завершен!"), 200);
        }
      }),
  };
});
