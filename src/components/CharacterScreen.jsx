import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./CharacterScreen.module.scss";
import characterImage from "../assets/character-image.png";
import skin1 from "../assets/skin1.png";
import skin2 from "../assets/skin2.png";
import swordIcon from "../assets/sword-icon.png";
import armorIcon from "../assets/armor-icon.png";
import helmIcon from "../assets/helm-icon.png";
import ringIcon from "../assets/ring-icon.png";
import necklaceIcon from "../assets/necklace-icon.png";
import bootsIcon from "../assets/boots-icon.png";
import sword1 from "../assets/sword1.png";
import sword2 from "../assets/sword2.png";
import sword3 from "../assets/sword3.png";

const equipmentData = {
  weapon: [
    { img: sword1, name: "Steel Sword", attack: 10, speed: 2 },
    { img: sword2, name: "Fire Blade", attack: 15, speed: 1 },
    { img: sword3, name: "Magic Sword", attack: 12, speed: 3 },
  ],
};

const equipmentNames = {
  [sword1]: "Steel Sword",
  [sword2]: "Fire Blade",
  [sword3]: "Magic Sword",
  [helmIcon]: "Iron Helm",
  [armorIcon]: "Leather Armor",
  [ringIcon]: "Magic Ring",
  [necklaceIcon]: "Golden Necklace",
  [bootsIcon]: "Swift Boots",
};

const CharacterScreen = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState({ attack: 10, defense: 5, speed: 7 });
  const [freePoints, setFreePoints] = useState(5);
  const [selectedSkin, setSelectedSkin] = useState(characterImage);
  const [selectedEquipment, setSelectedEquipment] = useState({
    weapon: null,
    helm: null,
    armor: null,
    ring: null,
    necklace: null,
    boots: null,
  });
  const [isEquipmentListOpen, setIsEquipmentListOpen] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const upgradeStat = (stat) => {
    if (freePoints > 0) {
      setStats((prevStats) => ({
        ...prevStats,
        [stat]: prevStats[stat] + 1,
      }));
      setFreePoints(freePoints - 1);
    }
  };

  const toggleEquipmentList = (type) => {
    setIsEquipmentListOpen(isEquipmentListOpen === type ? null : type);
  };

  return (
    <div className={styles.characterScreen}>
      <motion.img
        src={selectedSkin}
        alt="Character"
        className={`${styles.character} ${activeTab === "equipment" ? styles.characterCentered : ""}`}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {activeTab === "equipment" && (
        <>
          <div className={styles.weaponBlock} onClick={() => toggleEquipmentList("weapon")}>
            <img src={selectedEquipment.weapon || swordIcon} alt="Weapon" />
          </div>
          <div className={styles.helmBlock} onClick={() => toggleEquipmentList("helm")}>
            <img src={selectedEquipment.helm || helmIcon} alt="Helm" />
          </div>
          <div className={styles.armorBlock} onClick={() => toggleEquipmentList("armor")}>
            <img src={selectedEquipment.armor || armorIcon} alt="Armor" />
          </div>
          <div className={styles.bootsBlock} onClick={() => toggleEquipmentList("boots")}>
            <img src={selectedEquipment.boots || bootsIcon} alt="Boots" />
          </div>
          <div className={styles.ringBlock} onClick={() => toggleEquipmentList("ring")}>
            <img src={selectedEquipment.ring || ringIcon} alt="Ring" />
          </div>
          <div className={styles.necklaceBlock} onClick={() => toggleEquipmentList("necklace")}>
            <img src={selectedEquipment.necklace || necklaceIcon} alt="Necklace" />
          </div>
        </>
      )}
{/* Контент вкладок (фон скрывается при Equipment) */}
<div className={`${styles.infoBlock} ${activeTab === "equipment" ? styles.hidden : ""}`}>
  <div className={`${styles.content} ${styles.fixedHeight}`}>
    {activeTab === "stats" && (
      <div className={styles.statsBlock}>
        <p>Свободные очки: {freePoints}</p>
        {Object.keys(stats).map((stat) => (
          <div key={stat} className={styles.stat}>
            <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}: {stats[stat]}</span>
            <button onClick={() => upgradeStat(stat)}>+</button>
          </div>
        ))}
      </div>
    )}

    {activeTab === "skins" && (
      <div className={styles.skinsBlock}>
        <div className={styles.skins}>
          <img src={skin1} alt="Skin 1" onClick={() => setSelectedSkin(skin1)} />
          <img src={skin2} alt="Skin 2" onClick={() => setSelectedSkin(skin2)} />
        </div>
      </div>
    )}
  </div>
</div>
      <div className={`${styles.tabsContainer} ${activeTab === "equipment" ? styles.equipmentMode : styles.defaultMode}`}>
        <button className={activeTab === "stats" ? styles.activeTab : styles.inactiveTab} onClick={() => setActiveTab("stats")}>
          Stats
        </button>
        <button className={activeTab === "skins" ? styles.activeTab : styles.inactiveTab} onClick={() => setActiveTab("skins")}>
          Skins
        </button>
        <button className={activeTab === "equipment" ? styles.activeTab : styles.inactiveTab} onClick={() => setActiveTab("equipment")}>
          Equipment
        </button>
      </div>

      {isEquipmentListOpen && (
        <div className={styles.equipmentList}>
          <p>Выберите {isEquipmentListOpen}:</p>
          <div className={styles.equipmentIcons}>
            {equipmentData[isEquipmentListOpen]?.map((item) => (
              <img key={item.img} src={item.img} alt={item.name} onClick={() => setPreviewItem(item)} />
            ))}
          </div>
          <button onClick={() => setIsEquipmentListOpen(null)}>Закрыть</button>
        </div>
      )}

      {previewItem && (
        <div className={styles.previewWindow}>
          <h3>{previewItem.name}</h3>
          <img src={previewItem.img} alt={previewItem.name} />
          <p>⚔ Attack: {previewItem.attack}</p>
          <p>⚡ Speed: {previewItem.speed}</p>
          <button
            onClick={() => {
              setSelectedEquipment((prev) => ({ ...prev, weapon: previewItem.img }));
              setPreviewItem(null);
              setIsEquipmentListOpen(null);
            }}
          >
            Equip
          </button>
          <button className={styles.closeButton} onClick={() => setPreviewItem(null)}>X</button>
        </div>
      )}

      <div className={styles.selectedEquipmentInfo}>
        {Object.entries(selectedEquipment).map(([key, value]) =>
          value ? <p key={key}>{equipmentNames[value]}</p> : null
        )}
      </div>
    </div>
  );
};

export default CharacterScreen;
