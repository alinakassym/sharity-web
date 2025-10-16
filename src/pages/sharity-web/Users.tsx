import type { FC } from "react";
import { useState, useMemo } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import { useRequestGetUsers } from "@/hooks/useRequestGetUsers";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import UserProfileCard from "@/components/UserProfileCard";
import UserCardWithRoleEdit from "@/components/UserCardWithRoleEdit";
import LoadingScreen from "@/components/LoadingScreen";
import SearchHeader from "@/components/SearchHeader";
import type { UserData } from "@/hooks/useRequestCreateUser";
import Container from "@/components/Container";

const Users: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const paddingTop = useSafePaddingTop(48, 0);
  const platformName = useSafePlatform();
  const isTelegram = isTelegramApp();
  const { users, isLoading, error } = useRequestGetUsers();
  const { userData: currentUser } = useCurrentUser();
  const [searchValue, setSearchValue] = useState("");
  const [localUsers, setLocalUsers] = useState<UserData[]>([]);

  // Синхронизируем локальное состояние с загруженными пользователями
  useMemo(() => {
    setLocalUsers(users);
  }, [users]);

  // Проверяем, является ли текущий пользователь администратором
  const isAdmin = currentUser?.role === "admin";

  // Обработчик обновления роли пользователя
  const handleRoleUpdate = (telegramId: number, newRole: UserData["role"]) => {
    setLocalUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.telegramId === telegramId ? { ...user, role: newRole } : user,
      ),
    );
  };

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return localUsers;

    return localUsers.filter((user) => {
      const fullName = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const username = user.username?.toLowerCase() || "";

      return (
        fullName.includes(query) ||
        username.includes(query) ||
        user.telegramId.toString().includes(query)
      );
    });
  }, [localUsers, searchValue]);

  if (isLoading) return <LoadingScreen />;

  return (
    <Container
      paddingTop={
        platformName === "desktop"
          ? 64
          : platformName === "unknown"
            ? 64
            : paddingTop + 64
      }
    >
      {/* Search Header */}
      <SearchHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        backTo="/profile"
      />

      {/* Main Content */}
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
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
        {!error && filteredUsers.length === 0 && (
          <div
            style={{
              color: c.lightText,
              textAlign: "center",
              padding: 40,
            }}
          >
            {searchValue ? "Ничего не найдено" : "Пользователи не найдены"}
          </div>
        )}

        {/* Список пользователей */}
        {filteredUsers.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {filteredUsers.map((user) =>
              isAdmin ? (
                <UserCardWithRoleEdit
                  key={user.telegramId}
                  userData={user}
                  onRoleUpdate={handleRoleUpdate}
                />
              ) : (
                <UserProfileCard key={user.telegramId} userData={user} />
              ),
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Users;
