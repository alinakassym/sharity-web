import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
interface FullWidthButtonProps {
  iconName?: string;
  label: string;
  btnColor?: string;
  color?: string;
  onClick?: () => void;
}

const FullWidthButton: FC<FullWidthButtonProps> = ({
  iconName = "heart",
  label,
  btnColor,
  color,
  onClick,
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
        backgroundColor: btnColor ?? c.primary,
      }}
      onClick={() => onClick && onClick()}
    >
      <VuesaxIcon name={iconName} size={24} color={color ?? c.lighter} />
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          margin: 0,
          color: color ?? c.lighter,
        }}
      >
        {label}
      </p>
    </div>
  );
};

export default FullWidthButton;
