import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { getTelegramUser, isTelegramApp } from "@/lib/telegram";
import { useRequestCreateUser } from "@/hooks/useRequestCreateUser";
import AuthModal from "./AuthModal";
import LoadingScreen from "./LoadingScreen";

/**
 * Компонент для инициализации пользователя Telegram при старте приложения
 * Показывает модальное окно авторизации для новых пользователей
 * Автоматически обновляет данные для существующих пользователей
 */
const TelegramUserInit: FC = () => {
  const { createOrUpdateUser, checkUserExists } = useRequestCreateUser();
  const isInitialized = useRef(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  useEffect(() => {
    // Выполняем только один раз при монтировании
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Проверяем, что приложение запущено в Telegram
    if (!isTelegramApp()) {
      console.log("Приложение запущено не в Telegram");
      setIsCheckingUser(false);
      return;
    }

    const checkAndInitUser = async () => {
      const { user } = getTelegramUser();

      if (!user) {
        console.log("Данные пользователя Telegram не найдены");
        setIsCheckingUser(false);
        return;
      }

      console.log(
        `Проверка пользователя Telegram: ${user.username || user.first_name}`,
      );

      // Проверяем, существует ли пользователь в базе
      const userExists = await checkUserExists(user.id);

      if (userExists) {
        // Пользователь уже авторизован - обновляем данные без модального окна
        console.log("✅ Пользователь найден, обновляем данные");

        const userData = {
          telegramId: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          languageCode: user.language_code,
          photoUrl: user.photo_url,
        };

        const result = await createOrUpdateUser(userData);

        if (result.success) {
          console.log(
            "✅ Данные пользователя обновлены:",
            user.username || user.first_name,
          );
        } else {
          console.error("❌ Ошибка при обновлении пользователя:", result.error);
        }

        setIsCheckingUser(false);
      } else {
        // Новый пользователь - показываем модальное окно авторизации
        console.log("⚠️ Новый пользователь, требуется авторизация");
        setIsCheckingUser(false);
        setShowAuthModal(true);
      }
    };

    checkAndInitUser();
  }, [createOrUpdateUser, checkUserExists]);

  const handleAuthConfirm = async () => {
    const { user } = getTelegramUser();

    if (!user) {
      console.error("Не удалось получить данные пользователя");
      setShowAuthModal(false);
      return;
    }

    const userData = {
      telegramId: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      languageCode: user.language_code,
      photoUrl: user.photo_url,
    };

    const result = await createOrUpdateUser(userData);

    if (result.success) {
      console.log(
        "✅ Новый пользователь зарегистрирован:",
        user.username || user.first_name,
      );
      setShowAuthModal(false);
    } else {
      console.error("❌ Ошибка при регистрации пользователя:", result.error);
      alert(`Ошибка авторизации: ${result.error}`);
    }
  };

  const handleAuthCancel = () => {
    console.log("❌ Пользователь отменил авторизацию");
    setShowAuthModal(false);
    // Можно добавить редирект или показать сообщение
  };

  // Показываем экран загрузки во время проверки пользователя
  if (isCheckingUser) {
    return <LoadingScreen />;
  }

  // Показываем модальное окно авторизации для новых пользователей
  if (showAuthModal) {
    return (
      <AuthModal onConfirm={handleAuthConfirm} onCancel={handleAuthCancel} />
    );
  }

  // Для существующих пользователей ничего не показываем
  return null;
};

export default TelegramUserInit;
