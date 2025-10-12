import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./VuesaxIcon";

interface LocationHeaderProps {
  location?: string;
  onLocationClick?: () => void;
}

const LocationHeader: FC<LocationHeaderProps> = ({
  location = "Астана",
  onLocationClick,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <header
      style={{
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
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
          backgroundColor: colors.background,
        }}
      >
        <VuesaxIcon name="location" size={20} color={colors.primary} />
        <button
          onClick={onLocationClick}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: onLocationClick ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: colors.text,
              margin: 0,
            }}
          >
            {location}
          </p>
        </button>
      </div>
    </header>
  );
};

export default LocationHeader;
