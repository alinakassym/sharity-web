import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

interface MenuItem {
  id: string;
  image: string;
  label: string;
  path: string;
}

interface MenuButtonsProps {
  items: MenuItem[];
  from?: string; // Путь родительской страницы для правильной навигации назад
}

const MenuButtons: FC<MenuButtonsProps> = ({ items, from }) => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const handleClick = (path: string) => {
    // Передаем информацию о текущей странице для правильной навигации назад
    navigate(path, { state: { from } });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 32,
        padding: "16px 0",
        backgroundColor: colors.background,
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.path)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            outline: "none",
          }}
        >
          {/* Image Container */}
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 14,
              overflow: "hidden",
              backgroundColor: colors.surfaceColor,
            }}
          >
            <img
              src={item.image}
              alt={item.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Label */}
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.text,
              textAlign: "center",
            }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MenuButtons;
