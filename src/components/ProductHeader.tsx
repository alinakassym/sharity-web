// src/components/ProductHeader.tsx

import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
import { CloseWebViewButton } from "./CloseWebViewButton";
import { isTelegramApp } from "@/lib/telegram";
import LocationButton from "./LocationButton";
import {
  useSafePaddingTop,
  useTelegramSafeArea,
} from "@/hooks/useTelegramSafeArea";

interface ProductHeaderProps {
  location?: string;
  onGoBack?: () => void;
  backTo?: string; // Путь страницы, на которую возвращаемся при закрытии
  onLocationClick?: () => void;
}

const ProductHeader: FC<ProductHeaderProps> = ({
  location = "Астана",
  onGoBack,
  backTo,
  onLocationClick,
}) => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const safeArea = useTelegramSafeArea();
  const isTelegram = isTelegramApp();

  const topPadding = isTelegram ? (safeArea.top > 0 ? safeArea.top + 0 : 0) : 0;

  const paddingTop = useSafePaddingTop(64, 0);

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
        backgroundColor: isTelegram ? c.background : c.background,
        zIndex: 100,
      }}
    >
      {/* Location */}
      <div
        style={{
          position: "absolute",
          top: topPadding,
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
      <div
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          backgroundColor: c.background,
        }}
      >
        {/* кнопка назад */}
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
        <div
          style={{
            position: "relative",
            height: 64,
            display: "flex",
            flex: 1,
            alignItems: "center",
          }}
        >
          ВЕРНУТЬСЯ НАЗАД
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
            aria-label="Закрыть"
          >
            <VuesaxIcon name="close" size={8} color={c.accent} />
          </button>
        )}

        <CloseWebViewButton />
      </div>
    </div>
  );
};

export default ProductHeader;
