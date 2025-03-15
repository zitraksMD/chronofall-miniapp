import { motion } from "framer-motion";
import styles from "./Inventory.module.scss";
import invBG from "../Assets/battlepass-bg.png";
import { useEffect, useState } from "react";


const Inventory = ({ onClose }) => {
  const [inventory, setInventory] = useState(() => {
    const savedInventory = localStorage.getItem("inventory");
    return savedInventory ? JSON.parse(savedInventory) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedInventory = JSON.parse(localStorage.getItem("inventory")) || [];
      setInventory(savedInventory);
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);  

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: "-50%", x: "-50%" }}
        animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
        exit={{ opacity: 0, scale: 0.8, y: "-50%", x: "-50%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={styles.inventory}
        style={{
          backgroundImage: `url(${invBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <h1>Инвентарь</h1>
        <div className={styles.lootContainer}>
   {inventory.length > 0 ? (
    inventory.map((item, index) => (
      <motion.div key={index} className={styles.item} whileHover={{ scale: 1.1 }}>
        <img src={item.image} alt={item.name} className={styles.itemImage} />
        {item.count > 1 && ( // Показываем счетчик, только если предметов больше 1
          <div className={styles.itemCount}>
            x{item.count}
          </div>
        )}
      </motion.div>
    ))
  ) : (
    <p>Инвентарь пуст...</p>
  )}  
</div>
      </motion.div>
    </>
  );
};

export default Inventory;
