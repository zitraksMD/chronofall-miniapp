import React, { useState } from "react";
import { useGameStore } from "../../StoreChallenge/gameStore"; 
import styles from "./Joystick.module.scss";

const Joystick = () => {
  const { movePlayer } = useGameStore();
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  // 🔥 Движение персонажа
  const handleMove = (deltaX, deltaY) => {
    movePlayer(deltaX * 0.5, deltaY * 0.5);
    setJoystickPosition({ x: deltaX * 0.3, y: deltaY * 0.3 });
  };

  // ✅ Поддержка сенсора
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosition.x;
    const deltaY = touch.clientY - startPosition.y;
    handleMove(deltaX, deltaY);
    setStartPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setJoystickPosition({ x: 0, y: 0 });
  };

  // ✅ Поддержка мыши
  const handleMouseDown = (e) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (e.buttons !== 1) return; // ✅ Проверяем, что кнопка мыши зажата
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    handleMove(deltaX, deltaY);
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setJoystickPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className={styles.joystickContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className={styles.joystick}
        style={{
          transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
        }}
      />
    </div>
  );
};

export default Joystick;
