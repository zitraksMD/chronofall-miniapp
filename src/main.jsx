import React from "react";
import ReactDOM from "react-dom/client";
import MainPage from "./components/MainPage";
import { UserProvider } from "./components/Username";
import { GoldProvider } from "./components/GoldContext"; // ✅ Должен быть импорт

function App() {
  return (
    <UserProvider>
      <GoldProvider> {/* ✅ GoldProvider должен оборачивать все компоненты */}
        <MainPage />
      </GoldProvider>
    </UserProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
