import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
import { useTelegramSafeArea } from "@/hooks/useTelegramSafeArea";
import { isTelegramApp } from "@/lib/telegram";

interface LocationHeaderProps {
  location?: string;
  onLocationClick?: () => void;
}

const LocationHeader: FC<LocationHeaderProps> = ({
  location = "Астана",
  onLocationClick,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();
  const safeArea = useTelegramSafeArea();

  // Используем safe area если доступен, иначе дефолтные значения
  const topPadding = isTelegram ? (safeArea.top > 0 ? safeArea.top + 0 : 0) : 0;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: topPadding,
        // backgroundColor: c.background,
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          // backgroundColor: c.background,
        }}
      >
        <div
          style={{
            padding: "4px 10px 4px 6px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            borderRadius: 22,
            backgroundColor: c.opacity,
            backdropFilter: "blur(90px) saturate(180%)",
            WebkitBackdropFilter: "blur(220px) saturate(180%)", // Для Safari
          }}
          onClick={onLocationClick}
        >
          <VuesaxIcon name="location" size={20} color={c.primary} />
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: c.text,
              margin: 0,
            }}
          >
            {location}
          </p>
        </div>
      </div>
    </header>
  );
};

export default LocationHeader;
