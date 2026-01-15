// src/components/Container.tsx

import type { FC, ReactNode } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import LocationHeader from "@/components/LocationHeader";
import { isTelegramApp } from "@/lib/telegram";
import { useTelegramSafeArea } from "@/hooks/useTelegramSafeArea";

interface ThemeProviderProps {
  ref?: React.RefObject<HTMLDivElement>;
  paddingTop?: number;
  showLocationHeader?: boolean;
  children: ReactNode;
  onLocationClick?: () => void;
}

const Container: FC<ThemeProviderProps> = ({
  ref,
  paddingTop = 48,
  showLocationHeader = false,
  children,
  onLocationClick,
}) => {
  const safeArea = useTelegramSafeArea();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        paddingTop: paddingTop ? paddingTop : isTelegram ? paddingTop : 44,
        minHeight: `calc(100vh - ${safeArea.top}px)`,
        maxHeight: `calc(100vh - ${safeArea.top}px)`,
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
