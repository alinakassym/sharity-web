import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
interface FullWidthButtonProps {
  iconName?: string;
  label: string;
  btnColor?: string;
  color?: string;
  inProgress?: boolean;
  onClick?: () => void;
}

const FullWidthButton: FC<FullWidthButtonProps> = ({
  iconName = "heart",
  label,
  btnColor,
  color,
  onClick,
  inProgress = false,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  return (
    <div
      style={{
        width: "100%",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        gap: 16,
        backgroundColor: btnColor ?? c.primary,
        opacity: inProgress ? 0.7 : 1,
        cursor: inProgress ? "not-allowed" : "pointer",
      }}
      onClick={() => !inProgress && onClick && onClick()}
    >
      <VuesaxIcon name={iconName} size={24} color={color ?? c.lighter} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
        {inProgress && (
          <p
            style={{
              fontSize: 10,
              lineHeight: 1.1,
              margin: 0,
              color: c.lightText,
            }}
          >
            в разработке
          </p>
        )}
      </div>
    </div>
  );
};

export default FullWidthButton;
