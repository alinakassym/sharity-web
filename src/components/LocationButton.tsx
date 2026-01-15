// src/components/LocationButton.tsx

import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";

interface LocationButtonProps {
  location?: string;
  onClick?: () => void;
}

const LocationButton: FC<LocationButtonProps> = ({
  location = "Астана",
  onClick,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  return (
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
        backdropFilter: "blur(8px) saturate(180%)",
        WebkitBackdropFilter: "blur(8px) saturate(180%)", // Для Safari
      }}
      onClick={onClick}
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
  );
};

export default LocationButton;
