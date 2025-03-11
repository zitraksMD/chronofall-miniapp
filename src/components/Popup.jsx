import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Popup.module.scss";
import scrollImage from "../assets/свиток.png";

export const PopUp = ({ isOpen, loot, nextChapter }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen && !isClosing) return null;

  const handleClose = (callback) => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      callback();
    }, 500); // Длительность совпадает с анимацией
  };

  return (
    <div className={styles.overlay}>
      <motion.div
        className={styles.popup}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <img className={styles.scroll} src={scrollImage} alt="Scroll Background" />

        <div className={styles.content}>
          <p className={styles.title}>Глава завершена, вы получили такие предметы:</p>

          <div className={styles.lootContainer}>
            {loot.length > 0 ? (
              loot.map((item, index) => (
                <motion.div
                  key={index}
                  className={styles.lootItem}
                  whileHover={{ scale: 1.1 }}
                  onClick={() =>
                    setSelectedItem(selectedItem === item.name ? null : item.name)
                  }
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.lootImage}
                  />
                  {selectedItem === item.name && (
                    <div className={styles.lootTooltip}>{item.name}</div>
                  )}
                </motion.div>
              ))
            ) : (
              <p className={styles.noLoot}>Ты ничего не нашел...</p>
            )}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.menuButton} onClick={() => handleClose(() => window.location.href = "/")}>
            Leave
          </button>
          <button className={styles.nextButton} onClick={() => handleClose(nextChapter)}>
            Next chapter
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PopUp;
