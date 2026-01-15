import type { FC } from "react";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../theme/colors";

const Cart: FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <section
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        color: colors.text,
        padding: "16px",
        paddingBottom: "80px",
      }}
    >
      <h1
        style={{
          margin: "0 0 24px 0",
          fontSize: "24px",
          fontWeight: 600,
          color: colors.text,
        }}
      >
        Корзина
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          color: colors.lightText,
        }}
      >
        <p>Ваша корзина пуста</p>
      </div>
    </section>
  );
};

export default Cart;
