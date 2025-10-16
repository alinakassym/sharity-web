import type { FC } from "react";
import { useTelegramSafeArea } from "@/hooks/useTelegramSafeArea";
import { isTelegramApp } from "@/lib/telegram";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

/**
 * Компонент для отладки - показывает информацию о платформе и safe area
 * Используйте временно для проверки значений в разных системах
 */
const PlatformDebugInfo: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();
  const safeAreaData = useTelegramSafeArea();

  if (!isTelegram) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: 12,
        backgroundColor: c.background,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        fontSize: 11,
        maxWidth: 280,
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h4
        style={{
          margin: "0 0 8px 0",
          fontSize: 12,
          fontWeight: 600,
          color: c.text,
        }}
      >
        Platform Info
      </h4>

      <div style={{ color: c.text }}>
        <p style={{ margin: "4px 0" }}>
          <strong>Platform:</strong> {safeAreaData.platform}
        </p>
        {safeAreaData.platformRaw && (
          <p style={{ margin: "4px 0", fontSize: 10, color: c.text }}>
            Raw: {safeAreaData.platformRaw}
          </p>
        )}
      </div>

      <div
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${c.border}`,
        }}
      >
        <h4
          style={{
            margin: "0 0 6px 0",
            fontSize: 11,
            fontWeight: 600,
            color: c.text,
          }}
        >
          Safe Area:
        </h4>
        <div style={{ color: c.text, fontSize: 10 }}>
          <p style={{ margin: "2px 0" }}>Top: {safeAreaData.top}px</p>
          <p style={{ margin: "2px 0" }}>Bottom: {safeAreaData.bottom}px</p>
          <p style={{ margin: "2px 0" }}>Left: {safeAreaData.left}px</p>
          <p style={{ margin: "2px 0" }}>Right: {safeAreaData.right}px</p>
        </div>
      </div>
    </div>
  );
};

export default PlatformDebugInfo;
