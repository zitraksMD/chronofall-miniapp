import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Popup from "./Popup";
import styles from "./Chapter.module.scss";
import mainBg from "../assets/main-screen-bg.png";
import character from "../assets/character2_0.png";
import bossImage from "../assets/character2_0.png";
import Inventory from "./Inventory";
import { useUser } from "./Username";
import lootTable from "./lootTable"; // Импортируем таблицу лута


const Chapter = () => {
  const { username } = useUser();
  const [kills, setKills] = useState(0);
  const [bossHits, setBossHits] = useState(0);
  const [isBossFight, setIsBossFight] = useState(false);
  const [bossTimeLeft, setBossTimeLeft] = useState(10);
  const [loot, setLoot] = useState([]);
  const [isChapterComplete, setIsChapterComplete] = useState(false);
  const [chapter, setChapter] = useState(1);
  const [showInventory, setShowInventory] = useState(false);
  const [playerHP, setPlayerHP] = useState(100); // Добавляем ХП игрока
  const [isDefeated, setIsDefeated] = useState(false);

  const requiredKills = 10 + chapter - 1;
  const requiredBossHits = 15 + chapter - 1;
  const monsterDamage = 10 + chapter - 1; // Урон монстра раз в секунду
  const bossDamage = 20 + chapter - 5; // Урон босса раз в секунду

  useEffect(() => {
    let damageInterval;

    if ((isBossFight || !isChapterComplete) && !isDefeated) {
      damageInterval = setInterval(() => {
        setPlayerHP((prevHP) => {
          const newHP = prevHP - (isBossFight ? bossDamage : monsterDamage);
          if (newHP <= 0) {
            clearInterval(damageInterval);
            setIsDefeated(true);
            return 0;
          }
          return newHP;
        });
      }, 1000);
    }

    return () => clearInterval(damageInterval);
  }, [isBossFight, isChapterComplete, isDefeated]);

  const getLoot = (chapter) => {
    const chapterLoot = lootTable[chapter] || lootTable[1]; // Если нет лута для главы, берём 1-ю
    const roll = Math.random() * 100;
    let cumulativeChance = 0;
  
    for (let item of chapterLoot) {
      cumulativeChance += item.chance;
      if (roll <= cumulativeChance) return item;
    }
    return null;
  };

  const handleClick = () => {
    if (isChapterComplete || isDefeated) return;

    if (isBossFight) {
      if (bossHits < requiredBossHits - 1) {
        setBossHits(bossHits + 1);
      } else {
        setIsBossFight(false);
        setIsChapterComplete(true);
        const lootItem = getLoot();
        if (lootItem) setLoot([...loot, lootItem]);
      }
    } else {
      if (kills < requiredKills - 1) {
        setKills(kills + 1);
      } else {
        setIsBossFight(true);
        setBossHits(0);
        setBossTimeLeft(10);
      }
    }
  };

  const nextChapter = () => {
    setChapter(chapter + 1);
    setKills(0);
    setBossHits(0);
    setIsBossFight(false);
    setBossTimeLeft(10);
    setLoot([]);
    setIsChapterComplete(false);
    setPlayerHP(100);
    setIsDefeated(false);
  };

  return (
    <div 
      className={styles.chapter} 
      style={{ backgroundImage: `url(${mainBg})` }}
    >
      <div className={styles.username}>{username}</div>
      
      {showInventory ? (
        <Inventory loot={loot} setShowInventory={setShowInventory} />
      ) : (
        <>
          <h1>Глава {chapter}</h1>
          <div className={styles.healthBarWrapper}>
  <div className={styles.healthBar}>
    <motion.div
      className={styles.healthFill}
      initial={{ width: "100%" }}
      animate={{ width: `${playerHP}%` }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: playerHP > 50 ? "#4caf50" : playerHP > 20 ? "#ffa500" : "#ff4b4b"
      }}
    />
  </div>
  <p className={styles.healthText}>HP: {playerHP} / 100</p>
</div>
          <div className={styles.healthBarWrapper}>
  <div className={styles.healthBar}>
    <motion.div
      className={styles.healthFill}
      initial={{ width: "100%" }}
      animate={{ width: `${playerHP}%` }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: playerHP > 50 ? "#4caf50" : playerHP > 20 ? "#ffa500" : "#ff4b4b"
      }}
    />
  </div>
</div>
          <motion.img
            src={isBossFight ? bossImage : character}
            alt={isBossFight ? "Босс" : "Персонаж"}
            onClick={handleClick}
            className={`${styles.character} ${isBossFight ? styles.boss : ""}`}
          />
          
          {!isBossFight ? (
            <p>Монстр {kills + 1} / {requiredKills}</p>
          ) : (
            <p>Босс: {bossHits} / {requiredBossHits} (Время: {bossTimeLeft})</p>
          )}

          {isDefeated && (
            <p className="text-red-600">Ты проиграл! Но получаешь лут.</p>
          )}

          {isChapterComplete && (
            <Popup isOpen={isChapterComplete} loot={loot} nextChapter={nextChapter} />
          )}
        </>
      )}
<button 
  onClick={() => window.location.href = "/"} 
  className={styles.leaveButton}
>
  Leave
</button>
    </div>
  );
};

export default Chapter;
