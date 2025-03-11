import { motion } from "framer-motion";
import styles from "./Inventory.module.scss";
import invBG from "../assets/battlepass-bg.png";

export default function Inventory({ loot = [], onClose }) {
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
          {loot.length > 0 ? (
            loot.map((item, index) => (
              <motion.div
                key={index}
                className={`${styles.item} ${item.color}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
              </motion.div>
            ))
          ) : (
            <p>Инвентарь пуст...</p>
          )}
        </div>

        <motion.button
          className={styles["close-button"]}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          Закрыть инвентарь
        </motion.button>
      </motion.div>
    </>
  );
}
