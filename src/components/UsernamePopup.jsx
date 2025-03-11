import React, { useState } from "react";
import styles from "./UsernamePopup.module.scss";
import bgImage from "../assets/username-enter-bg.png";
import inputBgImage from "../assets/enter-name-bg.png";

const UsernamePopup = ({ onSave }) => {
  const [username, setUsername] = useState("");

  const handleSave = () => {
    if (username.trim()) {
      onSave(username);
    }
  };

  return (
    <div className={styles.popup} style={{ backgroundImage: `url(${bgImage})` }}>
      <div className={styles.inputContainer} style={{ backgroundImage: `url(${inputBgImage})` }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className={styles.input}
        />
      </div>
      <button onClick={handleSave} className={styles.saveButton}>Save</button>
    </div>
  );
};

export default UsernamePopup; // Экспортируем компонент по умолчанию
