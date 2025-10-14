import { useEffect, useRef } from "react";
import type { FC } from "react";
import { getTelegramUser, isTelegramApp } from "@/lib/telegram";
import { useRequestCreateUser } from "@/hooks/useRequestCreateUser";

/**
 * Компонент для инициализации пользователя Telegram при старте приложения
 * Сохраняет/обновляет данные пользователя в Firebase при первом запуске
 */
const TelegramUserInit: FC = () => {
  const { createOrUpdateUser } = useRequestCreateUser();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Выполняем только один раз при монтировании
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Проверяем, что приложение запущено в Telegram
    if (!isTelegramApp()) {
      console.log("Приложение запущено не в Telegram");
      return;
    }

    const initUser = async () => {
      const { user } = getTelegramUser();

      if (!user) {
        console.log("Данные пользователя Telegram не найдены");
        return;
      }

      console.log(`Инициализация пользователя Telegram: ${user?.username}`);

      // Сохраняем/обновляем пользователя в базе данных
      const userData = {
        telegramId: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        languageCode: user.language_code,
      };

      const result = await createOrUpdateUser(userData);

      if (result.success) {
        if (result.isNewUser) {
          console.log("✅ Новый пользователь зарегистрирован:");
          console.log(
            "✅ Новый пользователь зарегистрирован:",
            user.username || user.first_name,
          );
        } else {
          console.log("✅ Данные пользователя обновлены:");
          console.log(
            "✅ Данные пользователя обновлены:",
            user.username || user.first_name,
          );
        }
      } else {
        console.error("❌ Ошибка при сохранении пользователя:", result.error);
      }
    };

    initUser();
  }, [createOrUpdateUser]);

  // Компонент не рендерит ничего
  return null;
};

export default TelegramUserInit;
