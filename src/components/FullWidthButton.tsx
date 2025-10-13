import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
interface FullWidthButtonProps {
  iconName?: string;
  label: string;
  color?: string;
  iconColor?: string;
}

const FullWidthButton: FC<FullWidthButtonProps> = ({
  iconName = "heart",
  label,
  color,
  iconColor,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  return (
    <div
      style={{
        width: "100%",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        cursor: "pointer",
        gap: 16,
        backgroundColor: color ?? c.primary,
      }}
    >
      <VuesaxIcon name={iconName} size={24} color={iconColor ?? c.lighter} />
      <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{label}</p>
    </div>
  );
};

export default FullWidthButton;
