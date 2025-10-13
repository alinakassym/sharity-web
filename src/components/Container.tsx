import type { FC, ReactNode } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import LocationHeader from "@/components/LocationHeader";
import { isTelegramApp } from "@/lib/telegram";

interface ThemeProviderProps {
  paddingTop?: number;
  showLocationHeader?: boolean;
  children: ReactNode;
}

const Container: FC<ThemeProviderProps> = ({
  paddingTop = 48,
  showLocationHeader = false,
  children,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const isTelegram = isTelegramApp();

  return (
    <section
      style={{
        position: "relative",
        paddingTop: isTelegram ? paddingTop : 44,
        minHeight: "100vh",
        paddingBottom: "160px",
        backgroundColor: colors.background,
      }}
    >
      {showLocationHeader && <LocationHeader />}

      {children}
    </section>
  );
};

export default Container;
