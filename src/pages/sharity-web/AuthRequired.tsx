import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal, { type AuthPermissions } from "@/components/AuthModal";
import { getTelegramUser } from "@/lib/telegram";
import { useRequestCreateUser } from "@/hooks/useRequestCreateUser";

/**
 * Страница авторизации для пользователей с isConfirmed: false
 * Показывается, когда пользователь пытается получить доступ к ограниченным функциям
 */
const AuthRequired: FC = () => {
  const navigate = useNavigate();
  const { createOrUpdateUser } = useRequestCreateUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAuthConfirm = async (permissions: AuthPermissions) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const { user } = getTelegramUser();

    if (!user) {
      console.error("Не удалось получить данные пользователя");
      navigate("/");
      return;
    }

    // Обновляем пользователя с новыми разрешениями и isConfirmed: true
    const userData = {
      telegramId: user.id,
      username: user.username,
      firstName: permissions.includeFirstName ? user.first_name : undefined,
      lastName: permissions.includeLastName ? user.last_name : undefined,
      languageCode: user.language_code,
      photoUrl: permissions.includePhoto ? user.photo_url : undefined,
      isConfirmed: true, // Пользователь согласился с авторизацией
    };

    const result = await createOrUpdateUser(userData);

    if (result.success) {
      console.log(
        "✅ Пользователь обновлен (isConfirmed: true):",
        user.username || user.first_name,
      );
      // Перенаправляем на главную страницу
      navigate("/");
    } else {
      console.error("❌ Ошибка при обновлении пользователя:", result.error);
      alert(`Ошибка авторизации: ${result.error}`);
      navigate("/");
    }

    setIsProcessing(false);
  };

  const handleAuthCancel = () => {
    // Пользователь отменил авторизацию - возвращаем на главную
    console.log("⚠️ Пользователь отменил авторизацию");
    navigate("/");
  };

  return (
    <AuthModal onConfirm={handleAuthConfirm} onCancel={handleAuthCancel} />
  );
};

export default AuthRequired;
