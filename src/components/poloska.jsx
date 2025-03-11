import React from "react";
import styles from "./XPbar.module.scss";

const XPbar = ({ currentLevel, progress }) => {
  return (
    <div className={styles.xpBarContainer}>
      <span className={styles.levelText}>Lvl {currentLevel}</span>
      
      <div className={styles.xpProgressContainer}>
        <div className={styles.xpProgressBar} style={{ width: `${progress}%` }}></div>
      </div>

      <span className={styles.levelText}>Lvl {currentLevel + 1}</span>
    </div>
  );
};

export default XPbar;
