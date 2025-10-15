import type { FC } from "react";
import { useState, useMemo } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import { useRequestGetUsers } from "@/hooks/useRequestGetUsers";
import UserProfileCard from "@/components/UserProfileCard";
import LoadingScreen from "@/components/LoadingScreen";
import SearchHeader from "@/components/SearchHeader";

const Users: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();
  const { users, isLoading, error } = useRequestGetUsers();
  const [searchValue, setSearchValue] = useState("");

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
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
  }, [users, searchValue]);

  if (isLoading) return <LoadingScreen />;

  return (
    <section
      style={{
        paddingTop: isTelegram ? 112 : 64,
        minHeight: "100vh",
        paddingBottom: "74px",
        backgroundColor: c.background,
      }}
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
          paddingTop: isTelegram ? 156 : 64,
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
            {filteredUsers.map((user) => (
              <UserProfileCard key={user.telegramId} userData={user} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Users;
