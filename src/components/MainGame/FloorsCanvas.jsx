import React, { useRef, useEffect } from "react";
import { useFloorsStore } from "@/StoreMain/floorsStore";
import playerImageSrc from "@/Assets/archer-icon.png";
import ladderImageSrc from "@/Assets/ladder-icon.png";
import doorImageSrc from "@/Assets/door-icon.png";
import styles from "./FloorsCanvas.module.scss";

// Размер виртуального уровня:
const VIRTUAL_WIDTH = 667;
const VIRTUAL_HEIGHT = 375;

const FloorsCanvas = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const playerImageRef = useRef(new Image());
  const ladderImageRef = useRef(new Image());
  const doorImageRef = useRef(new Image());

  useEffect(() => {
    playerImageRef.current.src = playerImageSrc;
    ladderImageRef.current.src = ladderImageSrc;
    doorImageRef.current.src = doorImageSrc;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Функция установки размеров canvas равными размерам окна
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const renderScene = () => {
      // Обновляем физику
      useFloorsStore.getState().applyGravity();

      // Получаем актуальное состояние
      const state = useFloorsStore.getState();
      if (!state || !state.player) {
        animationFrameRef.current = requestAnimationFrame(renderScene);
        return;
      }
      const { player, floors, ladders, exitDoor } = state;

      // Очищаем canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Вычисляем коэффициент масштабирования:
      const scaleX = canvas.width / VIRTUAL_WIDTH;
      const scaleY = canvas.height / VIRTUAL_HEIGHT;
      // Используем минимальный, чтобы сохранить пропорции
      const scale = Math.min(scaleX, scaleY);

      // Центрируем сцену:
      const offsetX = (canvas.width - VIRTUAL_WIDTH * scale) / 2;
      const offsetY = (canvas.height - VIRTUAL_HEIGHT * scale) / 2;

      ctx.save();
      // Смещаем контекст, чтобы отцентрировать
      ctx.translate(offsetX, offsetY);
      // Применяем масштабирование
      ctx.scale(scale, scale);

      // Отрисовка платформ
      ctx.fillStyle = "brown";
      floors.forEach((floor) => {
        ctx.fillRect(floor.x, floor.y, floor.width, floor.height);
      });

      // Отрисовка лестниц
      ladders.forEach((ladder) => {
        ctx.drawImage(
          ladderImageRef.current,
          ladder.x,
          ladder.y,
          ladder.width,
          ladder.height
        );
      });

      // Отрисовка двери выхода
      ctx.drawImage(
        doorImageRef.current,
        exitDoor.x,
        exitDoor.y,
        exitDoor.width,
        exitDoor.height
      );

      // Отрисовка игрока
      ctx.drawImage(
        playerImageRef.current,
        player.x - 20,
        player.y - 40,
        40,
        40
      );

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
