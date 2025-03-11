import { createContext, useContext, useState, useEffect } from "react";

console.log('Username imported');

const UserContext = createContext();

const generateRandomUsername = () => {
  const adjectives = ["Swift", "Brave", "Mighty", "Silent", "Cunning"];
  const nouns = ["Eagle", "Tiger", "Dragon", "Panther", "Wolf"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective}${randomNoun}`;
};

export const UserProvider = ({ children }) => {
  console.log('UserProvider rendered');
  const [username, setUsername] = useState(localStorage.getItem("username") || generateRandomUsername());

  const saveUsername = (name) => {
    setUsername(name);
    localStorage.setItem("username", name);
  };

  return (
    <UserContext.Provider value={{ username, saveUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
