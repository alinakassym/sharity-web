import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

const LoadingScreen: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: c.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9998,
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: 48,
          height: 48,
          border: `4px solid ${c.surfaceColor}`,
          borderTop: `4px solid ${c.primary}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      {/* Text */}
      <p
        style={{
          marginTop: 24,
          fontSize: 16,
          color: c.lightText,
          fontWeight: 500,
        }}
      >
        Загрузка...
      </p>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
