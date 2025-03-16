import React, { useRef, useEffect } from "react";
import { useFloorsStore } from "@/StoreMain/floorsStore";
import playerImageSrc from "@/Assets/archer-icon.png";
import ladderImageSrc from "@/Assets/ladder-icon.png";
import doorImageSrc from "@/Assets/door-icon.png";
import monsterImageSrc from "@/Assets/monster-icon.png";
import arrowImageSrc from "@/Assets/arrow-icon.png"; 
import styles from "./FloorsCanvas.module.scss";

// Размер виртуального уровня (чтобы вместить платформы)
const VIRTUAL_WIDTH = 2000;
const VIRTUAL_HEIGHT = 1300;
const CAMERA_WIDTH = 667;
const CAMERA_HEIGHT = 375;
const arrowScale = 5;





const FloorsCanvas = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const playerImageRef = useRef(new Image());
  const ladderImageRef = useRef(new Image());
  const doorImageRef = useRef(new Image());
  const monsterImageRef = useRef(new Image());
  const arrowImageRef = useRef(new Image());


  // Загружаем изображения
  useEffect(() => {
    playerImageRef.current.src = playerImageSrc;
    ladderImageRef.current.src = ladderImageSrc;
    doorImageRef.current.src = doorImageSrc;
    
    monsterImageRef.current.onload = () => {
      console.log("✅ Monster image loaded successfully!");
    };
    monsterImageRef.current.onerror = () => {
      console.error("❌ Monster image failed to load!");
    };
    monsterImageRef.current.src = monsterImageSrc;
    arrowImageRef.current.onload = () => console.log("✅ Arrow image loaded successfully!");
  arrowImageRef.current.onerror = () => console.error("❌ Arrow image failed to load!");
  arrowImageRef.current.src = arrowImageSrc;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const store = useFloorsStore.getState();
    if (!store || typeof store.applyGravity !== "function") {
      console.error("❌ useFloorsStore не загружен или applyGravity не доступен!");
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const renderScene = () => {
      const state = useFloorsStore.getState();
      if (!state || !state.player || !state.monsters || !state.bullets) {
        animationFrameRef.current = requestAnimationFrame(renderScene);
        return;
      }
    
      // Обновляем физику, монстров и пули
      state.applyGravity();
      state.moveMonsters();
      if (typeof state.moveBullets === "function") {
        state.moveBullets();
      } else {
        console.error("❌ moveBullets() не найден в store");
      }
    
      // Допустим, хотим, чтобы игрок был примерно по центру камеры по вертикали:
const halfCamHeight = CAMERA_HEIGHT / 2;
// Предположим, что высота игрока ~40px, тогда "центр" игрока y + 20
const playerCenterY = state.player.y + 20;

let desiredCameraY = playerCenterY - halfCamHeight;
// Ограничиваем, чтобы камера не ушла за край уровня (по высоте)
if (desiredCameraY < 0) desiredCameraY = 0;
if (desiredCameraY > VIRTUAL_HEIGHT - CAMERA_HEIGHT) {
  desiredCameraY = VIRTUAL_HEIGHT - CAMERA_HEIGHT;
}

// Обновляем cameraY в Zustand
state.setCameraY(desiredCameraY);

      // ---- Здесь вставляем обновление cameraX (камеры по горизонтали) ----
      const playerCenter = state.player.x + 20; // предполагается, что 20 - это половина ширины игрока
      const halfCamera = CAMERA_WIDTH / 2;
      let desiredCameraX = playerCenter - halfCamera;
      if (desiredCameraX < 0) desiredCameraX = 0;
      if (desiredCameraX > VIRTUAL_WIDTH - CAMERA_WIDTH) {
        desiredCameraX = VIRTUAL_WIDTH - CAMERA_WIDTH;
      }
      // Обновляем cameraX в Zustand
      state.setCameraX(desiredCameraX);
      // -------------------------------------------------------------------
    
      // Извлекаем значения, включая cameraX и cameraY
      const {
        player = {},
        floors = [],
        ladders = [],
        exitDoor = {},
        monsters = [],
        bullets = [],
        cameraX = 0,
        cameraY = 0,
      } = state;
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      // Масштабирование по видимой области (камера)
      const scaleX = canvas.width / CAMERA_WIDTH;
      const scaleY = canvas.height / CAMERA_HEIGHT;
      const scale = Math.min(scaleX, scaleY);
    
      const offsetX = (canvas.width - CAMERA_WIDTH * scale) / 2;
      const offsetY = (canvas.height - CAMERA_HEIGHT * scale) / 2;
    
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
    
      // Смещаем сцену по камере: показываем только видимую область
      ctx.translate(-cameraX, -cameraY);
    
      // Отрисовка элементов сцены…
      floors.forEach((floor) => {
        ctx.fillStyle = "brown";
        ctx.fillRect(floor.x, floor.y, floor.width, floor.height);
      });
      
      ladders.forEach((ladder) => {
        ctx.drawImage(
          ladderImageRef.current,
          ladder.x,
          ladder.y,
          ladder.width,
          ladder.height
        );
      });
    
      ctx.drawImage(
        doorImageRef.current,
        exitDoor.x,
        exitDoor.y,
        exitDoor.width,
        exitDoor.height
      );
    
      monsters.forEach((monster) => {
        ctx.drawImage(
          monsterImageRef.current,
          monster.x,
          monster.y,
          monster.width,
          monster.height
        );
      });
    
      ctx.drawImage(
        playerImageRef.current,
        player.x,
        player.y,
        40,
        40
      );
    
      if (Array.isArray(bullets) && bullets.length > 0) {
        bullets.forEach((bullet) => {
          ctx.save();
          const centerX = bullet.x + bullet.width / 2;
          const centerY = bullet.y + bullet.height / 2;
          ctx.translate(centerX, centerY);
          const angle =
            bullet.direction === -1
              ? -Math.PI / 2
              : bullet.direction === 1
              ? Math.PI / 2
              : 0;
          ctx.rotate(angle);
          ctx.drawImage(
            arrowImageRef.current,
            - (bullet.width * arrowScale) / 2,
            - (bullet.height * arrowScale) / 2,
            bullet.width * arrowScale,
            bullet.height * arrowScale
          );
          ctx.restore();
        });
      } 
      
      ctx.restore();
    
      animationFrameRef.current = requestAnimationFrame(renderScene);
    };

    renderScene();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className={styles.canvasWrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default FloorsCanvas;
