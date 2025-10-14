# Структура данных пользователя Telegram

## Доступные данные из Telegram Mini App API

При запуске Mini App из Telegram, доступны следующие данные о пользователе:

### Обязательные поля:
- `id` (number) - Уникальный ID пользователя в Telegram
- `first_name` (string) - Имя пользователя

### Опциональные поля:
- `last_name` (string) - Фамилия пользователя
- `username` (string) - Логин в Telegram (например, @john_doe)
- `language_code` (string) - Код языка интерфейса (ru, en, и т.д.)
- `is_premium` (boolean) - Наличие Telegram Premium подписки

## Структура в Firebase (коллекция `users`)

```typescript
interface UserData {
  telegramId: number;        // ID пользователя в Telegram (используется как ID документа)
  username?: string;         // Логин в Telegram (@username)
  firstName: string;         // Имя
  lastName?: string;         // Фамилия
  languageCode?: string;     // Код языка (ru, en)
  isPremium?: boolean;       // Telegram Premium статус
  phoneNumber?: string;      // Номер телефона (зарезервировано для будущего)
  createdAt: Date;          // Дата первой регистрации
  lastLoginAt: Date;        // Дата последнего входа
}
```

## Как работает

1. **При первом запуске бота:**
   - Компонент `TelegramUserInit` автоматически запускается при старте приложения
   - Получает данные пользователя из Telegram Mini App API
   - Создает новый документ в коллекции `users` с ID = `telegramId`
   - Сохраняет все доступные данные

2. **При повторных запусках:**
   - Обновляет поле `lastLoginAt`
   - Обновляет остальные данные (username, isPremium и т.д.) на случай изменений

## Примечания

### Номер телефона
⚠️ **Номер телефона НЕ доступен** через стандартный Telegram Mini App API.

Для получения номера телефона необходимо:
- Использовать Telegram Bot API с методом `requestContact`
- Пользователь должен явно подтвердить предоставление номера
- Требуется дополнительная реализация на стороне бота

### Приватность
- Поле `username` может отсутствовать, если пользователь не установил его в настройках Telegram
- Все данные получаются только с согласия пользователя через Telegram

## Использование в коде

```typescript
import { useRequestCreateUser } from "@/hooks/useRequestCreateUser";
import { getTelegramUser } from "@/lib/telegram";

const { createOrUpdateUser } = useRequestCreateUser();
const { user } = getTelegramUser();

if (user) {
  await createOrUpdateUser({
    telegramId: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    languageCode: user.language_code,
    isPremium: user.is_premium,
  });
}
```
