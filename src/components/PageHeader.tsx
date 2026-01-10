// sharity-web/src/components/PageHeader.tsx

import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
import { CloseWebViewButton } from "./CloseWebViewButton";
import { isTelegramApp } from "@/lib/telegram";
import { useSafePaddingTop } from "@/hooks/useTelegramSafeArea";

interface PageHeaderProps {
  title?: string;
  backTo?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, backTo }) => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  // Используем safe area если доступен, иначе дефолтные значения
  const paddingTop = useSafePaddingTop(88, 0);

  const handleClose = () => {
    // Переходим на указанную страницу или на главную по умолчанию
    navigate(backTo || "/");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: paddingTop,
        borderBottom: "1px solid " + c.surfaceColor,
        backgroundColor: c.background,
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: c.background,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flex: 1,
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "40px",
            color: c.text,
          }}
        >
          {title}
        </div>

        {/* Close Button */}
        {isTelegram && (
          <button
            onClick={handleClose}
            style={{
              marginLeft: 8,
              marginRight: 8,
              padding: 0,
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "1px solid " + c.accent,
              cursor: "pointer",
              borderRadius: 20,
              transition: "background-color 0.2s ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.controlColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label="Закрыть поиск"
          >
            <VuesaxIcon name="close" size={8} color={c.accent} />
          </button>
        )}

        <CloseWebViewButton />
      </div>
    </div>
  );
};

export default PageHeader;
