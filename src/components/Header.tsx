import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
import { isTelegramApp } from "@/lib/telegram";
import { CloseWebViewButton } from "./CloseWebViewButton";

interface LocationHeaderProps {
  title?: string;
  showGoBackBtn?: boolean;
  showCloseBtn?: boolean;
  onGoBack?: () => void;
}

const Header: FC<LocationHeaderProps> = ({
  title = "",
  showGoBackBtn = false,
  showCloseBtn = true,
}) => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  const onGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigate(-1);
    }
  };

  const onClose = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: isTelegram ? 92 : 0,
        paddingRight: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        borderBottom: "1px solid " + c.surfaceColor,
        backgroundColor: isTelegram ? c.background : c.background,
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 44,
          display: "flex",
          flex: 1,
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
        }}
      >
        {/* кнопка назад */}
        {showGoBackBtn && (
          <div
            style={{
              paddingTop: 0,
              width: 56,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={onGoBack}
          >
            <VuesaxIcon name="arrow-left" size={24} color={c.primary} />
          </div>
        )}
        <h1
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: c.text,
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>
      {/* Close Button */}
      {isTelegram && showCloseBtn && (
        <button
          onClick={onClose}
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
  );
};

export default Header;
