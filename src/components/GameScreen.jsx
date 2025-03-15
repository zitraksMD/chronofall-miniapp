import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // ✅ Добавляем анимацию
import GameCanvas from "./GameCanvas";
import Joystick from "./Joystick";
import { useEnemiesStore } from "../store/enemiesStore";
import styles from "./GameScreen.module.scss";
import backgroundImage from "/src/Assets/challenge-background.png";

const GameScreen = ({ onClose }) => {
  const [wave, setWave] = useState(1);
  const [wavePhase, setWavePhase] = useState("countdown"); // "countdown" | "battle" | "transition" | "completed"
  const [countdown, setCountdown] = useState(3);
  const { enemies, spawnEnemy } = useEnemiesStore();
  const [showPopup, setShowPopup] = useState(false); // ✅ Показывать поп-ап после завершения
  const [loading, setLoading] = useState(true); // ✅ Состояние загрузки

  useEffect(() => {
    // ✅ Запускаем плавную загрузку перед началом Challenge
    setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 секунды загрузки
  }, []);

  useEffect(() => {
    if (wavePhase === "countdown") {
      let counter = 3;
      setCountdown(counter);
      const countdownInterval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);
        if (counter <= 0) {
          clearInterval(countdownInterval);
          setWavePhase("battle");
          spawnEnemy(); // Запускаем волну монстров
        }
      }, 1000);
    }
  }, [wavePhase]);

  useEffect(() => {
    if (wavePhase === "battle" && enemies.length === 0) {
      setWavePhase("transition");
      setTimeout(() => {
        if (wave < 3) {
          setWave(wave + 1);
          setWavePhase("countdown");
        } else {
          setWavePhase("completed");
          setTimeout(() => setShowPopup(true), 2000); // ✅ Показываем поп-ап через 2 сек.
        }
      }, 2000);
    }
  }, [enemies, wavePhase, wave]);

  return (
    <motion.div
      className={styles.gameContainer}
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      initial={{ opacity: 0, scale: 0.8, y: "-50%", x: "-50%" }}
      animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
      exit={{ opacity: 0, scale: 0.8, y: "-50%", x: "-50%" }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
    >
      <button className={styles.closeButton} onClick={onClose}>Exit</button>

      {loading ? (
        <div className={styles.loadingScreen}>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      ) : (
        <>
          {(wavePhase === "countdown" || wavePhase === "transition" || wavePhase === "completed") && (
            <div className={styles.overlay}>
              {wavePhase === "countdown" && <div className={styles.countdownText}>{countdown}</div>}
              {wavePhase === "transition" && <div className={styles.waveText}>WAVE {wave} COMPLETED!</div>}
              {wavePhase === "completed" && <div className={styles.waveText}>CHALLENGE COMPLETED!</div>}
              {wavePhase === "countdown" && <div className={styles.waveText}>WAVE {wave}</div>}
            </div>
          )}

          {wavePhase === "battle" && <GameCanvas />}
          {wavePhase === "battle" && <Joystick />}

          {showPopup && (
            <div className={styles.popupOverlay}>
              <div className={styles.popup}>
                <h2>CHALLENGE COMPLETED!</h2>
                <button className={styles.popupButton} onClick={onClose}>Exit</button>
                <button className={styles.popupButton} onClick={() => window.location.reload()}>Next Challenge</button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default GameScreen;
