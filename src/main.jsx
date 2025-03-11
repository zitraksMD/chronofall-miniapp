import React from "react";
import ReactDOM from "react-dom/client";
import MainPage from "./components/Mainpage";
import { UserProvider } from "./components/Username";

function App() {
  return (
    <UserProvider>
      <MainPage />
    </UserProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
