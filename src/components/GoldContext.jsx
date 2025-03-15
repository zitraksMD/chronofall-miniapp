import React, { createContext, useState, useContext, useEffect } from "react";

// Создаем контекст
const GoldContext = createContext();

// Хук для использования контекста золота
export const useGold = () => {
  const context = useContext(GoldContext);
  if (!context) {
    throw new Error("useGold must be used within a GoldProvider");
  }
  return context;
};

// Провайдер для управления золотом
export const GoldProvider = ({ children }) => {
  const [gold, setGold] = useState(() => {
    const savedGold = localStorage.getItem("gold");
    return savedGold ? parseInt(savedGold, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("gold", gold);
  }, [gold]);

  const addGold = (amount) => {
    setGold((prevGold) => prevGold + amount);
  };

  return (
    <GoldContext.Provider value={{ gold, addGold }}>
      {children}
    </GoldContext.Provider>
  );
};
