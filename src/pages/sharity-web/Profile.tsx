// src/pages/sharity-web/Profile.tsx
import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import UserProfileCard from "@/components/UserProfileCard";
import UserProductsCard from "@/components/UserProductsCard";
import LoadingScreen from "@/components/LoadingScreen";

const Profile: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();
  const { userData, isLoading, error } = useCurrentUser();

  if (isLoading) return <LoadingScreen />;

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

        {userData && <UserProductsCard />}
      </div>
    </section>
  );
};

export default Profile;
