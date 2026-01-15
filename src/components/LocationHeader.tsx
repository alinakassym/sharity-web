// src/components/LocationHeader.tsx

import type { FC } from "react";
import { useTelegramSafeArea } from "@/hooks/useTelegramSafeArea";
import { isTelegramApp } from "@/lib/telegram";
import LocationButton from "./LocationButton";

interface LocationHeaderProps {
  location?: string;
  onLocationClick?: () => void;
}

const LocationHeader: FC<LocationHeaderProps> = ({
  location = "Астана",
  onLocationClick,
}) => {
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
    </header>
  );
};

export default LocationHeader;
