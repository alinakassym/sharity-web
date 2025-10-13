import type { FC, ReactNode } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import LocationHeader from "@/components/LocationHeader";
import { isTelegramApp } from "@/lib/telegram";

interface ThemeProviderProps {
  showLocationHeader?: boolean;
  children: ReactNode;
}

const Container: FC<ThemeProviderProps> = ({
  showLocationHeader = false,
  children,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const isTelegram = isTelegramApp();

  return (
    <section
      style={{
        paddingTop: isTelegram ? 92 : 44,
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
