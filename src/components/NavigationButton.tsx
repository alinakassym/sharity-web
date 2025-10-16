import type { FC, ReactNode } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";

interface NavigationButtonProps {
  label: string;
  onClick: () => void;
  icon?: string; // Имя иконки VuesaxIcon (по умолчанию "arrow-right")
  iconSize?: number; // Размер иконки (по умолчанию 24)
  leftIcon?: ReactNode; // Опциональная иконка слева от текста
  disabled?: boolean;
}

/**
 * Переиспользуемая кнопка навигации с текстом и стрелкой
 * Используется для переходов между страницами
 */
const NavigationButton: FC<NavigationButtonProps> = ({
  label,
  onClick,
  icon = "arrow-right",
  iconSize = 24,
  leftIcon,
  disabled = false,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        backgroundColor: c.surfaceColor,
        borderRadius: 20,
        padding: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.2s",
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = "0.8";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = "1";
        }
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {leftIcon}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: c.text,
          }}
        >
          {label}
        </div>
      </div>
      <VuesaxIcon name={icon} size={iconSize} color={c.text} />
    </div>
  );
};

export default NavigationButton;
