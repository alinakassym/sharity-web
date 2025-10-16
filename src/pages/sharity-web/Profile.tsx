// src/pages/sharity-web/Profile.tsx
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSafePaddingTop } from "@/hooks/useTelegramSafeArea";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import UserProfileCard from "@/components/UserProfileCard";
import LoadingScreen from "@/components/LoadingScreen";
import NavigationButton from "@/components/NavigationButton";

const Profile: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const paddingTop = useSafePaddingTop(48, 0);
  const isTelegram = isTelegramApp();
  const { userData, isLoading, error } = useCurrentUser();

  if (isLoading) return <LoadingScreen />;

  const handleNavigateTo = (path: string) => {
    navigate(path);
  };

  // Проверяем, является ли пользователь админом
  const isAdmin = userData?.role === "admin";

  return (
    <section
      style={{
        paddingTop: isTelegram ? paddingTop : 0,
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
          <NavigationButton
            label="Мои публикации"
            onClick={() => handleNavigateTo("/my-publications")}
          />
        )}

        {/* Кнопка перехода к пользователям (только для админа) */}
        {userData && isAdmin && (
          <>
            <NavigationButton
              label="Пользователи"
              onClick={() => handleNavigateTo("/users")}
            />
            <NavigationButton
              label="Справочники"
              onClick={() => handleNavigateTo("/dictionaries")}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Profile;
