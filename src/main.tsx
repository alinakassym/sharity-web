import { useEffect } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { getTG, requestTgFullscreen } from "./lib/telegram.ts";

// eslint-disable-next-line react-refresh/only-export-components
function Bootstrap() {
  useEffect(() => {
    const tg = getTG();
    if (!tg) return;

    // Разворачиваем на всю высоту
    tg.expand();

    // Блокируем закрытие при «скролле вниз»
    try {
      tg.disableVerticalSwipes();
    } catch {
      // тихо игнорируем, если клиент старый
    }

    // Дополнительно: спрашивать подтверждение при закрытии
    tg.enableClosingConfirmation();

    // Готово
    tg.ready();
    requestTgFullscreen();
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Bootstrap />);
