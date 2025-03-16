import React, { useState, useEffect } from "react";
import Chapter from "./Chapter";
import Inventory from "./Inventory";
import Shop from "./Shop";
import BattlepassPopup from "./Battlepass";
import UsernamePopup from "./UsernamePopup";
import CharacterScreen from "./CharacterScreen"; 
import styles from "./MainPage.module.scss";
import mainBg from "../Assets/main-screen-bg.png";
import { useUser } from "./Username";
import { motion, AnimatePresence } from "framer-motion";
import GoldDisplay from "./GoldDisplay";
import GameScreen from "./Challenges/GameScreen"; 
import shopIcon from "../Assets/icon-shop.png";
import playIcon from "../Assets/icon-play.png";
import inventoryIcon from "../Assets/icon-inventory.png";
import characterIcon from "../Assets/character-icon.png"; 
import FloorsScreen from "./MainGame/FloorsScreen";
import VideoTransition from "./VideoTransition"; // импортируем видео-компонент

const MainPage = () => {
  const { username, saveUsername } = useUser();
  const [activeTab, setActiveTab] = useState("menu"); 
  const [isPopupVisible, setIsPopupVisible] = useState(!username);

  useEffect(() => {
    const handleBackButton = () => {
      if (activeTab !== "menu") {
        setActiveTab("menu");
        return true;
      }
    };

    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "floors") {
      if (window.screen.orientation && window.screen.orientation.lock) {
        window.screen.orientation.lock("landscape").catch((err) => {
          console.log("❌ Ошибка блокировки ориентации:", err);
        });
      }
    } else {
      if (window.screen.orientation && window.screen.orientation.unlock) {
        window.screen.orientation.unlock();
      }
    }
  }, [activeTab]); 

  return (
    <>
      {activeTab === "floors" ? (
        <FloorsScreen onClose={() => setActiveTab("menu")} />
      ) : (
        <div
          className={styles.container}
          style={{ backgroundImage: `url(${mainBg})`, width: "375px", height: "667px" }}
        >
          {isPopupVisible && <UsernamePopup onSave={saveUsername} />}
          {username && <div className={styles.username}>{username}</div>}
          <GoldDisplay /> 
          <button
            className={styles.chronopassButton}
            onClick={() => setActiveTab("battlepass")}
          >
            Chronopass
          </button>

          <AnimatePresence>
            {activeTab === "video" && (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%", height: "100%" }}
              >
                <VideoTransition onEnd={() => setActiveTab("floors")} />
              </motion.div>
            )}
           {activeTab === "floors" && (
  <motion.div
    key="floors"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
    style={{ width: "100%", height: "100%" }}
  >
    <FloorsScreen onClose={() => setActiveTab("menu")} />
  </motion.div>
)}

            {activeTab === "challenge" && (
              <motion.div
                key="challenge"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ width: "100%", height: "100%" }}
              >
                <GameScreen onClose={() => setActiveTab("menu")} />
              </motion.div>
            )}
            {activeTab === "shop" && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: "0%" }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ width: "100%", height: "100%" }}
              >
                <Shop onClose={() => setActiveTab("menu")} />
              </motion.div>
            )}
            {activeTab === "battlepass" && (
              <motion.div
                key="battlepass"
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: "0%" }}
                exit={{ opacity: 0, y: "-100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ width: "100%", height: "100%" }}
              >
                <BattlepassPopup onClose={() => setActiveTab("menu")} />
              </motion.div>
            )}
            {activeTab === "inventory" && (
              <Inventory onClose={() => setActiveTab("menu")} loot={[]} />
            )}
            {activeTab === "play" && (
              <Chapter openInventory={() => setActiveTab("inventory")} />
            )}
            {activeTab === "character" && (
              <motion.div
                key="character"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ width: "100%", height: "100%" }}
              >
                <CharacterScreen onClose={() => setActiveTab("menu")} />
              </motion.div>
            )}
            {activeTab === "menu" && (
              <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className={styles.menu}
              >
                <button className={styles.playButton} onClick={() => setActiveTab("play")}>
                  Play
                </button>
                <button className={styles.challengeButton} onClick={() => setActiveTab("challenge")}>
                  Challenge
                </button>
                {/* Изменяем активный экран на "video" */}
                <button className={styles.mainButton} onClick={() => setActiveTab("video")}>
                  Main
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Навигационное меню снизу */}
          <div className={styles.navbar}>
            <button
              className={`${styles.navButton} ${activeTab === "shop" ? styles.active : ""}`}
              onClick={() => setActiveTab("shop")}
            >
              <img src={shopIcon} alt="Shop" />
            </button>
            <button
              className={`${styles.navButton} ${activeTab === "play" ? styles.active : ""}`}
              onClick={() => setActiveTab("menu")}
            >
              <img src={playIcon} alt="Play" />
            </button>
            <button
              className={`${styles.navButton} ${activeTab === "inventory" ? styles.active : ""}`}
              onClick={() => setActiveTab("inventory")}
            >
              <img src={inventoryIcon} alt="Inventory" />
            </button>
            <button
              className={`${styles.navButton} ${activeTab === "character" ? styles.active : ""}`}
              onClick={() => setActiveTab("character")}
            >
              <img src={characterIcon} alt="Character" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainPage;
