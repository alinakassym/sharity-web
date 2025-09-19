import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../theme/colors";
import VuesaxIcon from "./VuesaxIcon";

interface TabItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const tabs: TabItem[] = [
  {
    id: "store",
    label: "Магазин",
    icon: "shop",
    path: "/sharity-web/store",
  },
  {
    id: "favorites",
    label: "Избранное",
    icon: "heart",
    path: "/sharity-web/favorites",
  },
  {
    id: "cart",
    label: "Корзина",
    icon: "shopping-cart",
    path: "/sharity-web/cart",
  },
  {
    id: "orders",
    label: "Мои заказы",
    icon: "document",
    path: "/sharity-web/orders",
  },
];

const TabBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const handleTabPress = (path: string) => {
    navigate(path);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        borderTop: `1px solid ${colors.surfaceColor}`,
        display: "flex",
        paddingBottom: "16px",
        zIndex: 1000,
      }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabPress(tab.path)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              padding: "8px 4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? colors.primary : colors.text,
              transition: "color 0.2s ease",
            }}
          >
            <VuesaxIcon
              name={tab.icon}
              size={28}
              color={isActive ? colors.primary : colors.text}
            />
            <span
              style={{
                fontSize: 10,
                color: isActive ? colors.primary : colors.text,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TabBar;
