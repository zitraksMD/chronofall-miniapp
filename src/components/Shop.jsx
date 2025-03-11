import React from "react";
import styles from "./Shop.module.scss";

const Shop = ({ onClose, onBuyItem }) => {
  return (
    <div className={styles.shopContainer}>
      <h1 className={styles.shopTitle}>Магазин</h1>

      <div className={styles.shopContent}>
        <p>Здесь будет магазин!</p>
      </div>
    </div>
  );
};

export default Shop; // 👈 ВАЖНО! Должен быть экспорт по умолчанию
