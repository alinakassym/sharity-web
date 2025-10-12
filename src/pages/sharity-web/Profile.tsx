// src/pages/sharity-web/Profile.tsx
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/VuesaxIcon";
import MainTabBar from "@/components/MainTabBar";
import { getTelegramUser, isTelegramApp } from "@/lib/telegram";
interface MenuItem {
  id: string;
  title: string;
  icon: string;
  path?: string;
  action?: () => void;
}

const Profile: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { user } = getTelegramUser();
  const isTelegram = isTelegramApp();

  console.log("Telegram isTelegram:", isTelegram);

  const profileMenuItems: MenuItem[] = [
    {
      id: "my-ads",
      title: "Мои объявления",
      icon: "document",
      path: "/my-ads",
    },
    {
      id: "favorites",
      title: "Избранное",
      icon: "heart",
      path: "/favorites",
    },
    {
      id: "orders",
      title: "Мои заказы",
      icon: "shop",
      path: "/orders",
    },
  ];

  const settingsMenuItems: MenuItem[] = [
    {
      id: "settings",
      title: "Настройки",
      icon: "setting",
      path: "/settings",
    },
    {
      id: "help",
      title: "Помощь и поддержка",
      icon: "message-question",
      path: "/help",
    },
  ];

  const handleMenuClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <section
      style={{
        paddingTop: isTelegram ? 48 : 0,
        minHeight: "100vh",
        backgroundColor: colors.background,
        paddingBottom: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 16px",
          backgroundColor: colors.surfaceColor,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: colors.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              color: colors.lighter,
            }}
          >
            👤
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: colors.text,
                margin: "0 0 4px",
              }}
            >
              {user?.first_name} {user?.last_name}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: colors.lightText,
                margin: 0,
              }}
            >
              displayUsername
            </p>
          </div>

          {/* Edit Button */}
          <button
            style={{
              padding: 8,
              backgroundColor: colors.background,
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => navigate("/profile/edit")}
          >
            <VuesaxIcon name="edit" size={24} color={colors.text} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          backgroundColor: colors.border,
          margin: "1px 0",
        }}
      >
        {[
          { label: "Объявления", value: "0" },
          { label: "Продажи", value: "0" },
          { label: "Отзывы", value: "0" },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              padding: "16px 12px",
              backgroundColor: colors.surfaceColor,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: colors.text,
                margin: "0 0 4px",
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontSize: 12,
                color: colors.lightText,
                margin: 0,
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Profile Menu */}
      <div style={{ padding: "16px 0" }}>
        <div
          style={{
            backgroundColor: colors.surfaceColor,
            borderRadius: 0,
          }}
        >
          {profileMenuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 16px",
                backgroundColor: "transparent",
                border: "none",
                borderBottom:
                  index < profileMenuItems.length - 1
                    ? `1px solid ${colors.border}`
                    : "none",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.controlColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <VuesaxIcon name={item.icon} size={24} color={colors.text} />
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: colors.text,
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {item.title}
              </span>
              <VuesaxIcon
                name="arrow-right"
                size={20}
                color={colors.lightText}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Settings Menu */}
      <div style={{ padding: "0 0 16px" }}>
        <div
          style={{
            backgroundColor: colors.surfaceColor,
            borderRadius: 0,
          }}
        >
          {settingsMenuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 16px",
                backgroundColor: "transparent",
                border: "none",
                borderBottom:
                  index < settingsMenuItems.length - 1
                    ? `1px solid ${colors.border}`
                    : "none",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.controlColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <VuesaxIcon name={item.icon} size={24} color={colors.text} />
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: colors.text,
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {item.title}
              </span>
              <VuesaxIcon
                name="arrow-right"
                size={20}
                color={colors.lightText}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div style={{ padding: "0 16px" }}>
        <button
          onClick={() => {
            // TODO: Implement logout
            console.log("Logout clicked");
          }}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: colors.surfaceColor,
            border: `1px solid ${colors.error}`,
            borderRadius: 12,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 600,
            color: colors.error,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.error + "10";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.surfaceColor;
          }}
        >
          Выйти из аккаунта
        </button>
      </div>

      <MainTabBar />
    </section>
  );
};

export default Profile;
