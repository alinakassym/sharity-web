import type { FC } from 'react';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from "../../theme/colors";

const Orders: FC = () => {
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
          margin: 0,
          fontSize: "24px",
          fontWeight: 600,
          color: colors.text,
        }}
      >
        Мои заказы
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          color: colors.lightText,
        }}
      >
        <p>В разработке</p>
      </div>
    </section>
  );
};

export default Orders;