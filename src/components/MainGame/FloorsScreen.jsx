import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import FloorsCanvas from "./FloorsCanvas";
import { useFloorsStore } from "@/StoreMain/floorsStore";
import floorsBackground from "@/Assets/floors-background.png";
import styles from "./FloorsScreen.module.scss";


const FloorsScreen = ({ onClose }) => {
  const store = useFloorsStore();

  if (!store || !store.movePlayer) {
    console.error("❌ useFloorsStore не загружен!");
    return null;
  }

  const { movePlayer, jump, checkExit } = store;
  const moveIntervalRef = useRef(null);

  const startMoving = (delta) => {
    if (moveIntervalRef.current) return;
    moveIntervalRef.current = setInterval(() => {
      movePlayer(delta);
      // можно вызвать checkExit() если нужно
    }, 100);
  };
  
  const stopMoving = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
        case "a":
          movePlayer(-10);
          break;
        case "ArrowRight":
        case "d":
          movePlayer(10);
          break;
        case " ":
          if (!event.repeat) {  // проверяем, чтобы не было повторного срабатывания при удержании
            console.log("⬆️ Прыжок!");
            jump();
          }
          break;
        default:
          break;
      }
      checkExit();
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer, jump, checkExit]);
  

  return ReactDOM.createPortal(
    <div
      className={styles.fullscreenContainer}
      style={{
        backgroundImage: `url(${floorsBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <button className={styles.closeButton} onClick={onClose}>
        Exit
      </button>
      <FloorsCanvas />
  
      {/* Кнопки управления */}
      <div className={styles.controls}>
        <button
          className={styles.controlButton}
          onMouseDown={() => startMoving(-10)}
          onMouseUp={stopMoving}
          onMouseLeave={stopMoving}
          onTouchStart={(e) => {
            e.preventDefault();
            startMoving(-10);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopMoving();
          }}
        >
          ◀️
        </button>
        <button
          className={styles.controlButton}
          onMouseDown={() => jump()}
          onTouchStart={(e) => {
            e.preventDefault();
            jump();
          }}
        >
          🆙
        </button>
        <button
          className={styles.controlButton}
          onMouseDown={() => startMoving(10)}
          onMouseUp={stopMoving}
          onMouseLeave={stopMoving}
          onTouchStart={(e) => {
            e.preventDefault();
            startMoving(10);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopMoving();
          }}
        >
          ▶️
        </button>
      </div>
    </div>,
    document.body
  );
  
};

export default FloorsScreen;
