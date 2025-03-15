import React, { useState, useEffect } from "react";
import { useGold } from "./GoldContext";
import styles from "./GoldDisplay.module.scss"; // Создадим для стилей
import coinIcon from "../assets/coin-icon.png"; // Иконка золота
import bgImage from "../assets/block.png"; // Фон

const GoldDisplay = () => {
  const { gold } = useGold();
  const [displayedGold, setDisplayedGold] = useState(gold);

  useEffect(() => {
    if (gold > displayedGold) {
      const increment = Math.ceil((gold - displayedGold) / 10); // Дробим увеличение на 10 шагов
      const interval = setInterval(() => {
        setDisplayedGold((prev) => {
          if (prev + increment >= gold) {
            clearInterval(interval);
            return gold;
          }
          return prev + increment;
        });
      }, 50); // Скорость анимации (50 мс)

      return () => clearInterval(interval);
    }
  }, [gold]);

  return (
    <div className={styles.goldContainer}>
      <img src={bgImage} alt="Background" className={styles.bgImage} />
      <div className={styles.goldContent}>
        <img src={coinIcon} alt="Gold" className={styles.coinIcon} />
        <span className={styles.goldText}>{gold}</span>
      </div>
    </div>
  );
};

export default GoldDisplay;
