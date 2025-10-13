import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";

const Orders: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  return (
    <section
      style={{
        paddingTop: isTelegram ? 48 : 44,
        minHeight: "100vh",
        paddingBottom: "160px",
        backgroundColor: c.background,
      }}
    >
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          color: c.lightText,
          backgroundColor: c.background,
        }}
      >
        В разработке...
      </div>
    </section>
  );
};

export default Orders;
