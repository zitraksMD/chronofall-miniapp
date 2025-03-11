import React, { useState, useEffect } from "react";
import XPbar from "./poloska";
import styles from "./Battlepass.module.scss";
import closeIcon from "../Assets/closebutton.png";

const BattlepassPopup = ({ onClose }) => {
  const currentLevel = 3;
  const progress = 65;

  const [activeTab, setActiveTab] = useState("rewards");
  const [activeWeek, setActiveWeek] = useState("week1");

  useEffect(() => {
    const rewardsTab = document.getElementById("rewardsTab");
    const questsTab = document.getElementById("questsTab");
    const rewardsList = document.getElementById("rewardsList");
    const questsList = document.getElementById("questsList");

    if (!rewardsTab || !questsTab || !rewardsList || !questsList) {
      console.error("❌ Один из элементов не найден");
      return;
    }

    const handleRewardsClick = () => {
      rewardsList.classList.remove("hidden");
      questsList.classList.add("hidden");

      document.querySelectorAll(".rewardItem").forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.remove("hidden");
      });

      rewardsTab.classList.add("active");
      questsTab.classList.remove("active");
    };

    const handleQuestsClick = () => {
      document.querySelectorAll(".rewardItem").forEach((item) => {
        item.classList.add("hidden");
      });

      rewardsList.classList.add("hidden");
      questsList.classList.remove("hidden");

      questsTab.classList.add("active");
      rewardsTab.classList.remove("active");
    };

    rewardsTab.addEventListener("click", handleRewardsClick);
    questsTab.addEventListener("click", handleQuestsClick);

    return () => {
      rewardsTab.removeEventListener("click", handleRewardsClick);
      questsTab.removeEventListener("click", handleQuestsClick);
    };
  }, []);

  const quests = {
    week1: [
      { text: "Defeat 10 monsters", reward: 100, progress: 10, required: 10 },
      { text: "Earn 500 gold", reward: 150, progress: 300, required: 500 },
      { text: "Complete 3 battles", reward: 200, progress: 3, required: 3 },
    ],
    week2: [
      { text: "Use 5 potions", reward: 120, progress: 2, required: 5 },
      { text: "Reach level 5", reward: 180, progress: 5, required: 5 },
      { text: "Open 2 treasure chests", reward: 250, progress: 1, required: 2 },
    ],
    week3: [
      { text: "Collect 10 gems", reward: 100, progress: 5, required: 10 },
      { text: "Defeat a boss", reward: 300, progress: 0, required: 1 },
      { text: "Upgrade an item", reward: 150, progress: 1, required: 1 },
    ],
    week4: [
      { text: "Complete daily quest", reward: 200, progress: 1, required: 1 },
      { text: "Earn 1000 gold", reward: 350, progress: 600, required: 1000 },
      { text: "Win 5 battles", reward: 400, progress: 2, required: 5 },
    ],
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>

        {/* 🔘 Кнопка закрытия */}
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>

        <h1 className={styles.chronopassTitle}>Chronopass</h1>

        <XPbar currentLevel={currentLevel} progress={progress} />

        <div className={styles.battlepassContainer}>
          {activeTab === "rewards" ? (
            <>
              <div className={styles.battlepassScroll}>
                <div className={styles.columnHeader}><span>Free</span></div>
                <div className={styles.columnHeader}><span>Level</span></div>
                <div className={styles.columnHeader}><span>Paid</span></div>
              </div>

              <div className={styles.battlepassGrid}>
  {[...Array(20)].map((_, i) => (
    <div key={i} className={styles.battlepassRow}>
      <div className={styles.rewardFree}>Free {i + 1}</div>
      <div className={styles.levelLine}>{i + 1}</div>
      <div className={styles.rewardPaid}>Paid {i + 1}</div>
    </div>
  ))}
</div>
            </>
          ) : (
            <>
              <div className={styles.weekSelector}>
                {["week1", "week2", "week3", "week4"].map((week, i) => (
                  <button
                    key={week}
                    className={`${styles.weekButton} ${activeWeek === week ? styles.active : styles.inactive}`}
                    onClick={() => setActiveWeek(week)}
                  >
                    Week {i + 1}
                  </button>
                ))}
              </div>

              <div className={styles.questsList}>
                {quests[activeWeek].map((quest, index) => (
                  <div key={index} className={styles.questItem}>
                    <div className={styles.questText}>{quest.text}</div>
                    <div className={styles.questReward}>🎖 {quest.reward} XP</div>
                    {quest.progress >= quest.required ? (
                      <button className={styles.claimButton}>Claim</button>
                    ) : (
                      <div className={styles.progressText}>
                        {quest.progress}/{quest.required} completed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.bottomButtons}>
          <button
            id="rewardsTab"
            className={`${styles.tabButton} ${activeTab === "rewards" ? styles.active : styles.inactive}`}
            onClick={() => setActiveTab("rewards")}
          >
            Rewards
          </button>

          <button
            id="questsTab"
            className={`${styles.tabButton} ${activeTab === "quests" ? styles.active : styles.inactive}`}
            onClick={() => setActiveTab("quests")}
          >
            Quests
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattlepassPopup;
