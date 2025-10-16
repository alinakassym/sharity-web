import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import { useSafePaddingTop } from "@/hooks/useTelegramSafeArea";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import NavigationButton from "@/components/NavigationButton";
import Container from "@/components/Container";

const Dictionaries: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const paddingTop = useSafePaddingTop(48, 0);
  const isTelegram = isTelegramApp();
  const { userData, isLoading } = useCurrentUser();

  if (isLoading) return <LoadingScreen />;

  // Проверяем, является ли пользователь администратором
  const isAdmin = userData?.role === "admin";

  // Если не админ, показываем сообщение об ошибке
  if (!isAdmin) {
    return (
      <Container paddingTop={paddingTop + 44}>
        <Header title="Справочники" showGoBackBtn />
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: c.error,
          }}
        >
          У вас нет доступа к этой странице
        </div>
      </Container>
    );
  }

  return (
    <Container paddingTop={paddingTop + 44}>
      <Header title="Справочники" showGoBackBtn />

      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Описание страницы */}
        <div
          style={{
            padding: 16,
            backgroundColor: c.surfaceColor,
            borderRadius: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: c.lightText,
              lineHeight: 1.5,
            }}
          >
            Управление справочниками системы. Здесь вы можете редактировать
            категории, добавлять новые значения и настраивать параметры.
          </p>
        </div>

        {/* Список справочников */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <NavigationButton
            label="Категории"
            onClick={() => {
              // TODO: Реализовать переход к странице управления категориями
              console.log("Переход к категориям");
            }}
          />

          <NavigationButton
            label="Города"
            onClick={() => {
              // TODO: Реализовать переход к странице управления городами
              console.log("Переход к городам");
            }}
            disabled
          />

          <NavigationButton
            label="Настройки приложения"
            onClick={() => {
              // TODO: Реализовать переход к настройкам приложения
              console.log("Переход к настройкам");
            }}
            disabled
          />
        </div>
      </div>
    </Container>
  );
};

export default Dictionaries;
