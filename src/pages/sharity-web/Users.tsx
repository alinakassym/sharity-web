import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import { useRequestGetUsers } from "@/hooks/useRequestGetUsers";
import UserProfileCard from "@/components/UserProfileCard";
import LoadingScreen from "@/components/LoadingScreen";
import Container from "@/components/Container";

const Users: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();
  const { users, isLoading, error } = useRequestGetUsers();

  if (isLoading) return <LoadingScreen />;

  return (
    <Container showLocationHeader paddingTop={isTelegram ? 92 : 44}>
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          backgroundColor: c.background,
        }}
      >
        {/* Заголовок */}
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: c.text,
            margin: 0,
          }}
        >
          Пользователи
        </h1>

        {/* Ошибка */}
        {error && (
          <div
            style={{
              color: c.error || "#FF6B6B",
              textAlign: "center",
              padding: 20,
              backgroundColor: c.surfaceColor,
              borderRadius: 12,
            }}
          >
            {error}
          </div>
        )}

        {/* Пустое состояние */}
        {!error && users.length === 0 && (
          <div
            style={{
              color: c.lightText,
              textAlign: "center",
              padding: 40,
            }}
          >
            Пользователи не найдены
          </div>
        )}

        {/* Список пользователей */}
        {users.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {users.map((user) => (
              <UserProfileCard key={user.telegramId} userData={user} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Users;
