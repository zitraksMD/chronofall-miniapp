import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Popup } from "./Popup";
import styles from "./Chapter.module.scss";
import mainBg from "../assets/main-screen-bg.png";
import Inventory from "./Inventory";
import { useUser } from "./Username";
import lootTable from "./lootTable";
import monsterTable from "./monsterTable";
import { useGold } from "./GoldContext";
import coinIcon from "../assets/coin-icon.png"; // Убедись, что путь правильный
import GoldDisplay from "./GoldDisplay";



const Chapter = () => {
  const { username } = useUser();
  const [kills, setKills] = useState(0);
  const [isBossFight, setIsBossFight] = useState(false);
  const [bossTimeLeft, setBossTimeLeft] = useState(10);
  const [loot, setLoot] = useState([]);
  const [isChapterComplete, setIsChapterComplete] = useState(false);
  const [chapter, setChapter] = useState(1);
  const [showInventory, setShowInventory] = useState(false);
  const [playerHP, setPlayerHP] = useState(100);
  const [isDefeated, setIsDefeated] = useState(false);
  const [showBossFightScreen, setShowBossFightScreen] = useState(false);
  const [bossFightText, setBossFightText] = useState("");
  const [monsterHP, setMonsterHP] = useState(monsterTable[0].hp);
  const [bossHP, setBossHP] = useState(100);
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [enemy, setEnemy] = useState(monsterTable[0]); // Стартовый монстр
  const { addGold } = useGold(); // Функция для добавления золота
  const [goldEarned, setGoldEarned] = useState(0);
  const [showGoldAnimation, setShowGoldAnimation] = useState(false);


  const damage = enemy.damage;
  const playerAttack = 40;

  useEffect(() => {
    let damageInterval;
    if ((!isBossFight && !isChapterComplete) || (isBossFight && !isDefeated)) {
      damageInterval = setInterval(() => {
        setPlayerHP((prevHP) => {
          const newHP = prevHP - enemy.damage;
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
  }, [isBossFight, isChapterComplete, isDefeated, enemy]);

  useEffect(() => {
    if (goldEarned > 0) {
      const timeout = setTimeout(() => {
        addGold(goldEarned);
      }, 100); // Даем React завершить рендер перед обновлением контекста
      return () => clearTimeout(timeout);
    }
  }, [goldEarned]);
  
  const getLoot = (chapter) => {
    console.log(`🔍 getLoot вызван для главы ${chapter}`);
  
    const chapterLoot = lootTable[chapter];
  
    if (!chapterLoot) {
      console.warn(`⚠️ Нет лута для главы ${chapter}, используем главу 1`);
      return null;
    }
  
    console.log(`🎁 Возможный лут:`, chapterLoot);
  
    const roll = Math.random() * 100;
    console.log(`🎲 Выпавшее число: ${roll}`);
  
    let cumulativeChance = 0;
    for (let item of chapterLoot) {
      cumulativeChance += item.chance;
      console.log(`🔹 Проверяем предмет: ${item.name} (накопленный шанс: ${cumulativeChance}%)`);
  
      if (roll <= cumulativeChance) {
        console.log(`✅ Выпал предмет:`, item);
        return item;
      }
    }
  
    console.log("❌ Лут не выпал");
    return null;
  };
  
  

  const handleClick = () => {
    if (isBossFight) {
      setBossHP((prevHP) => {
        const newHP = prevHP - playerAttack;
        if (newHP <= 0) {
          console.log(`🏆 Босс ${enemy.name} побежден!`);
    
          if (enemy.name === "Final Boss") { // После убийства финального босса
            const newLoot = getLoot(chapter); // Генерируем лут
            console.log("🎁 Получен лут:", newLoot);
          
            setLoot((prevLoot) => {
              const updatedLoot = newLoot ? [...prevLoot, newLoot] : prevLoot;
              console.log("📦 Обновленный инвентарь:", updatedLoot);
          
              // Обновляем инвентарь в localStorage
              const savedInventory = JSON.parse(localStorage.getItem("inventory")) || [];
              const newInventory = [...savedInventory, newLoot];
              localStorage.setItem("inventory", JSON.stringify(newInventory));
          
              return updatedLoot;
            });
 // 🎉 **Начисление золота**
 const goldToAdd = Math.floor(Math.random() * 51) + 50; // 50-100 золота
 console.log(`💰 Получено золота: ${goldToAdd}`);

 setGoldEarned(goldToAdd);
 setShowGoldAnimation(true);

 // Добавляем золото в контекст через 1 секунду
 setTimeout(() => {
   addGold(goldToAdd);
   setShowGoldAnimation(false);
 }, 1000);
            setIsChapterComplete(true);
          }
           else {
            // Если это не финальный босс, просто возвращаемся к обычным монстрам
            setIsBossFight(false);
            setBossHP(100 + chapter * 10);
            setCurrentMonsterIndex(3);
            setEnemy(monsterTable[3]);
            setMonsterHP(monsterTable[3].hp);
          }
    
          return 0;
        }
        return newHP;
      });
    }    
     else {
      setMonsterHP((prevHP) => {
        const newHP = prevHP - playerAttack;
        if (newHP <= 0) {
          const newKills = kills + 1;
          setKills(newKills);
  
          if (newKills === 2) {
            // Первый босс
            const boss = monsterTable.find((m) => m.isBoss && m.name === "Boss 1");
            setBossFightText("Boss Fight");
            setShowBossFightScreen(true);
            
            setTimeout(() => {
              setShowBossFightScreen(false);
              setIsBossFight(true);
              setBossHP(boss.hp);
              setEnemy(boss);
            }, 2000); // Затемнение на 2 секунды
            
          } else if (newKills === 4) {
            // 3-й монстр
            setCurrentMonsterIndex(3);
            setEnemy(monsterTable[3]);
            setMonsterHP(monsterTable[3].hp);
            
          } else if (newKills === 5) {
            // Финальный босс
            const finalBoss = monsterTable.find((m) => m.isBoss && m.name === "Final Boss");
            setBossFightText("Final Boss");
            setShowBossFightScreen(true);
  
            setTimeout(() => {
              setShowBossFightScreen(false);
              setIsBossFight(true);
              setBossHP(finalBoss.hp);
              setEnemy(finalBoss);
            }, 2500); // Затемнение на 2.5 секунды
            
          } else {
            // Обычный монстр (1, 2, 3, 4)
            setCurrentMonsterIndex((prevIndex) => prevIndex + 1);
            setEnemy(monsterTable[newKills]);
            setMonsterHP(monsterTable[newKills].hp);
          }
          return 0;
        }
        return newHP;
      });
    }
  };  

  const nextChapter = () => {
    console.log("📢 Функция nextChapter вызвана!");
    setChapter((prev) => prev + 1);
    setKills(0);
    setMonsterHP(30 + chapter * 5);
    setBossHP(100 + chapter * 10);
    setIsBossFight(false);
    setBossTimeLeft(10);
    setIsChapterComplete(false);
    setPlayerHP(100);
    setIsDefeated(false);
  };
  
  
  

  return (
    <div className={styles.chapter} style={{ backgroundImage: `url(${mainBg})` }}>
  <GoldDisplay /> {/* Баланс золота всегда виден */}
  <div className={styles.username}>{username}</div>


      {showInventory ? (
        <Inventory inventory={loot} onClose={() => setShowInventory(false)} />
      ) : (
        <>{showBossFightScreen && (
          <motion.div
            className={styles.bossFightScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className={styles.bossFightText}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{ color: bossFightText === "Final Boss" ? "red" : "white" }}
            >
              {bossFightText}
            </motion.h1>
          </motion.div>
        )}                
          <h1>Глава {chapter}</h1>

          {/* HP Монстра/Босса */}
<div className={styles.healthBarWrapper}>
  {isBossFight ? (
    <div className={styles.healthBar}>
      <motion.div
        className={styles.healthFill}
        initial={{ width: "100%" }}
        animate={{ width: `${bossHP}%` }}
        transition={{ duration: 0.3 }}
        style={{ backgroundColor: "purple" }}
      />
    </div>
  ) : (
    <div className={styles.healthBar}>
      <motion.div
        className={styles.healthFill}
        initial={{ width: "100%" }}
        animate={{ width: `${monsterHP}%` }}
        transition={{ duration: 0.3 }}
        style={{ backgroundColor: "red" }}
      />
    </div>
  )}
  <p className={styles.healthText}>
  {isBossFight
    ? `Босс HP: ${bossHP} / ${enemy.hp}`
    : `Монстр HP: ${monsterHP} / ${enemy.hp}`}
</p>
</div>
          <motion.img
            src={enemy.image} // Используем картинку из monsterTable
            alt={enemy.name}
            onClick={handleClick}
            className={`${styles.character} ${isBossFight ? styles.boss : ""}`}
          />

          {!isBossFight ? (
            <p>Монстр {kills + 1} / {10 + chapter - 1}</p>
          ) : (
            <p>Босс: HP {bossHP} / {100 + chapter * 10}</p>
          )}

          {isDefeated && <p className="text-red-600">Ты проиграл! Но получаешь лут.</p>}
          {showGoldAnimation && (
  <motion.div
    className={styles.goldContainer}
    initial={{ scale: 0, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0, opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <img src="/gold-icon.png" alt="Gold" className={styles.goldIcon} />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
    >
      +{goldEarned} Gold
    </motion.p>
  </motion.div>
)}
          <Popup
            isOpen={isChapterComplete || isDefeated}
            loot={loot}
            nextChapter={nextChapter}
            restartChapter={() => window.location.reload()} // Перезапускаем текущую главу
            isWin={!isDefeated} // Если проиграл, то false, иначе true
/>

          {/* HP Игрока */}
          <div className={styles.playerHealthWrapper}>
            <div className={styles.healthBar}>
              <motion.div
                className={styles.healthFill}
                initial={{ width: "100%" }}
                animate={{ width: `${playerHP}%` }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: playerHP > 50 ? "#4caf50" : playerHP > 20 ? "#ffa500" : "#ff4b4b",
                }}
              />
            </div>
            <p className={styles.healthText}>Your HP: {playerHP} / 100</p>
          </div>
        </>
      )}

      <button onClick={() => window.location.href = "/"} className={styles.leaveButton}>
        Leave
      </button>
    </div>
  );
};

export default Chapter;
