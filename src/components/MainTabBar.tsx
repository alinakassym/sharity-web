import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useColorScheme } from "../hooks/useColorScheme";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Colors } from "../theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";

interface TabItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const tabs: TabItem[] = [
  {
    id: "home",
    label: "Главная",
    icon: "home",
    path: "/",
  },
  {
    id: "create",
    label: "Создать",
    icon: "add",
    path: "/add",
  },
  {
    id: "profile",
    label: "Профиль",
    icon: "person",
    path: "/profile",
  },
];

const MainTabBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { userData } = useCurrentUser();

  // Проверяем, подтвердил ли пользователь авторизацию
  const isUserConfirmed = userData?.isConfirmed ?? true;

  const handleTabPress = (path: string, tabId: string) => {
    // Если пользователь не подтвердил авторизацию и пытается перейти на ограниченный таб
    if (!isUserConfirmed && (tabId === "create" || tabId === "profile")) {
      // Передаем целевую страницу в state, чтобы после авторизации перенаправить туда
      navigate("/auth-required", { state: { redirectTo: path } });
      return;
    }
    navigate(path);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 16,
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        backgroundColor: colors.background,
        borderTop: `1px solid ${colors.surfaceColor}`,
        zIndex: 1000,
      }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabPress(tab.path, tab.id)}
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
              transition: "color 0.2s ease, opacity 0.2s ease",
              outline: "none",
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

export default MainTabBar;
