// sharity-web/src/components/Header.tsx

import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTelegramSafeArea } from "@/hooks/useTelegramSafeArea";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
import { isTelegramApp } from "@/lib/telegram";
import { CloseWebViewButton } from "./CloseWebViewButton";
import LocationButton from "./LocationButton";

interface LocationHeaderProps {
  location?: string;
  title?: string;
  showGoBackBtn?: boolean;
  showCloseBtn?: boolean;
  onGoBack?: () => void;
  onLocationClick?: () => void;
}

const Header: FC<LocationHeaderProps> = ({
  location = "Астана",
  title = "",
  showGoBackBtn = false,
  showCloseBtn = true,
  onLocationClick,
}) => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const safeArea = useTelegramSafeArea();
  const isTelegram = isTelegramApp();

  const onGoBack = () => {
    navigate(-1);
  };

  const onClose = () => {
    navigate(-1);
  };

  const hasSafeArea = safeArea.top > 0;

  const topPadding = isTelegram
    ? safeArea.top > 0
      ? safeArea.top + 48
      : 0
    : 0;

  const topPadding2 = isTelegram
    ? safeArea.top > 0
      ? safeArea.top + 0
      : 0
    : 0;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: isTelegram ? topPadding : 0,
        borderBottom: "1px solid " + c.surfaceColor,
        backgroundColor: isTelegram ? c.background : c.background,
        zIndex: 100,
      }}
    >
      {/* Location */}
      {hasSafeArea && (
        <div
          style={{
            position: "fixed",
            top: topPadding2,
            left: "50%",
            transform: "translateX(-50%)",
            paddingLeft: 16,
            paddingRight: 16,
            height: isTelegram ? 48 : 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            // backgroundColor: c.background,
          }}
        >
          <LocationButton location={location} onClick={onLocationClick} />
        </div>
      )}
      <div
        style={{
          paddingRight: 16,
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            height: 64,
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
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                backgroundColor: c.controlColor,
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
    </div>
  );
};

export default Header;
