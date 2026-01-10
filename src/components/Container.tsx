// sharity-web/src/components/Container.tsx

import type { FC, ReactNode } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import LocationHeader from "@/components/LocationHeader";
import { isTelegramApp } from "@/lib/telegram";

interface ThemeProviderProps {
  paddingTop?: number;
  showLocationHeader?: boolean;
  children: ReactNode;
  onLocationClick?: () => void;
}

const Container: FC<ThemeProviderProps> = ({
  paddingTop = 48,
  showLocationHeader = false,
  children,
  onLocationClick,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  return (
    <section
      style={{
        position: "relative",
        paddingTop: paddingTop ? paddingTop : isTelegram ? paddingTop : 44,
        minHeight: "100vh",
        paddingBottom: "160px",
        backgroundColor: c.background,
      }}
    >
      {showLocationHeader && (
        <LocationHeader onLocationClick={onLocationClick} />
      )}

      {children}
    </section>
  );
};

export default Container;
