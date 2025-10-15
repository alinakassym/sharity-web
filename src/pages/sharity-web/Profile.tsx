// src/pages/sharity-web/Profile.tsx
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import UserProfileCard from "@/components/UserProfileCard";
import LoadingScreen from "@/components/LoadingScreen";
import VuesaxIcon from "@/components/icons/VuesaxIcon";

const Profile: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();
  const { userData, isLoading, error } = useCurrentUser();

  if (isLoading) return <LoadingScreen />;

  const handleNavigateToPublications = () => {
    navigate("/my-publications");
  };

  return (
    <section
      style={{
        paddingTop: isTelegram ? 48 : 44,
        minHeight: "100vh",
        paddingBottom: "74px",
        backgroundColor: c.background,
      }}
    >
      <div
        style={{
          padding: 16,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 16,
          backgroundColor: c.background,
        }}
      >
        {error && (
          <div
            style={{
              color: c.error || "#FF6B6B",
              textAlign: "center",
              padding: 20,
            }}
          >
            {error}
          </div>
        )}

        {userData && <UserProfileCard userData={userData} />}

        {/* Кнопка перехода к публикациям */}
        {userData && (
          <div
            onClick={handleNavigateToPublications}
            style={{
              backgroundColor: c.surfaceColor,
              borderRadius: 20,
              padding: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: c.text,
              }}
            >
              Мои публикации
            </div>
            <VuesaxIcon name="arrow-right" size={24} color={c.text} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
