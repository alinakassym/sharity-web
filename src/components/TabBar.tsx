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
        paddingBottom: "12px",
        paddingLeft: "8px",
        paddingRight: "8px",
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
              gap: "4px",
              padding: "8px 4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? colors.primary : colors.lightText,
              transition: "color 0.2s ease",
            }}
          >
            <VuesaxIcon
              name={tab.icon}
              size={28}
              color={isActive ? colors.primary : colors.lightText}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? colors.primary : colors.lightText,
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
