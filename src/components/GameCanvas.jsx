import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { useGameStore } from "../store/gameStore"; 
import { useBulletsStore } from "../store/bulletsStore";
import { useEnemiesStore } from "../store/enemiesStore";
import arrowImageSrc from "../Assets/arrow-icon.png";
import playerImageSrc from "../Assets/archer-icon.png";
import enemyImageSrc from "../Assets/enemy-icon.png";

console.log("✅ GameCanvas загружен, создаём canvas!");

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const { player, movePlayer } = useGameStore();
  const { bullets, shoot, updateBullets } = useBulletsStore();
  const { enemies, spawnEnemy, updateEnemies } = useEnemiesStore();
  const playerBodyRef = useRef(null);
  const arrowImageRef = useRef(null);
  const playerImageRef = useRef(null);
  const enemyImageRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    arrowImageRef.current = new Image();
    arrowImageRef.current.src = arrowImageSrc;

    playerImageRef.current = new Image();
    playerImageRef.current.src = playerImageSrc;

    enemyImageRef.current = new Image();
    enemyImageRef.current.src = enemyImageSrc;
  }, []);

  useEffect(() => {
    const engine = Matter.Engine.create();
    const world = engine.world;
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine,
      options: {
        width: 375,
        height: 667,
        wireframes: false,
        background: "transparent",
      },
    });

    const playerBody = Matter.Bodies.rectangle(player.x, player.y, 40, 40, { inertia: Infinity });
    Matter.World.add(world, playerBody);
    playerBodyRef.current = playerBody;

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
    };
  }, []);

  useEffect(() => {
    if (playerBodyRef.current) {
      Matter.Body.setPosition(playerBodyRef.current, { x: player.x, y: player.y });
    }
  }, [player.x, player.y]);

  // ✅ Стрельба идёт постоянно, независимо от движения
  useEffect(() => {
    const shootingInterval = setInterval(() => {
      if (useEnemiesStore.getState().enemies.length > 0) {
        useBulletsStore.getState().shoot(); // ✅ Теперь `shoot()` существует
      }
      useBulletsStore.getState().updateBullets();
    }, 500); // 🔥 Теперь стреляет раз в 2 секунды
  
    return () => clearInterval(shootingInterval);
  }, [player.x, player.y]); // ✅ Следит за изменениями позиции персонажа
  

  useEffect(() => {
    const enemySpawnInterval = setInterval(() => {
      spawnEnemy();
    }, 1000);

    return () => clearInterval(enemySpawnInterval);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      useBulletsStore.getState().updateBullets();
      useEnemiesStore.getState().updateEnemies();
    }, 50);
  
    return () => clearInterval(gameLoop);
  }, []);  

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
  
    const renderScene = () => {
      ctx.clearRect(0, 0, 375, 667);
  
      // ✅ Отрисовываем персонажа
      ctx.drawImage(playerImageRef.current, player.x - 20, player.y - 20, 40, 40);
  
      // ✅ Отрисовываем врагов
      enemies.forEach((enemy) => {
        ctx.drawImage(enemyImageRef.current, enemy.x, enemy.y, 40, 40);
      });
  
      // ✅ Отрисовываем стрелы с поворотом
      bullets.forEach((bullet) => {
        const angle = Math.atan2(bullet.vy, bullet.vx); // Вычисляем угол направления
        ctx.save(); // Сохраняем текущее состояние холста
        ctx.translate(bullet.x + 10, bullet.y + 20); // Перемещаем центр в точку пули
        ctx.rotate(angle + Math.PI / 2); // Поворачиваем в направлении движения
        ctx.drawImage(arrowImageRef.current, -10, -20, 20, 40); // Рисуем пулю
        ctx.restore(); // Восстанавливаем холст
      });
  
      requestAnimationFrame(renderScene);
    };
  
    renderScene();
  }, [bullets, enemies, player.x, player.y]);
  

  // ✅ Управление мышкой (персонаж двигается, пока зажата кнопка)
  const handleMouseDown = (e) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;

    console.log("🔥 handleMouseMove вызван! Двигаем на:", deltaX, deltaY);

    movePlayer(deltaX * 0.3, deltaY * 0.3);
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width="375"
      height="667"
      onMouseDown={(e) => {
        console.log("🔥 Кликнули по экрану!", e.clientX, e.clientY);
        setStartPosition({ x: e.clientX, y: e.clientY });
        setIsDragging(true);
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={() => {
        console.log("🛑 Отпустили мышку!");
        setIsDragging(false);
      }}
    />
  );
};

export default GameCanvas;
