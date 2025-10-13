import type { FC } from 'react';
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import ProductHeader from "@/components/ProductHeader";

const Orders: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <section
      style={{
        paddingTop: isTelegram ? 112 : 44,
        minHeight: "100vh",
        paddingBottom: "160px",
        backgroundColor: c.background,
      }}
    >
      <ProductHeader onGoBack={handleBackClick} />
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