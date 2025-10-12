# Telegram Mini App Setup

## Что сделано:

### 1. Создан хук `useTelegram`
Файл: `src/hooks/useTelegram.ts`

Хук предоставляет доступ к Telegram Web App API:
- `user` - данные пользователя из Telegram (id, first_name, last_name, username, photo_url)
- `webApp` - полный доступ к Telegram WebApp API
- `isReady` - статус инициализации
- Вспомогательные методы: showBackButton, showMainButton, hapticFeedback, close, openLink, showAlert, showConfirm

### 2. Добавлен Telegram Web App Script
Файл: `index.html`

Добавлен скрипт: `https://telegram.org/js/telegram-web-app.js`

### 3. Интегрирован с Profile
Файл: `src/pages/sharity-web/Profile.tsx`

Страница профиля теперь показывает:
- Имя пользователя из Telegram
- Username или ID пользователя
- В режиме разработки показываются mock данные

## Как создать Telegram Mini App:

### Шаг 1: Создать бота
1. Открой Telegram и найди @BotFather
2. Отправь команду `/newbot`
3. Следуй инструкциям и создай бота
4. Сохрани токен бота

### Шаг 2: Создать Web App
1. Отправь @BotFather команду `/newapp`
2. Выбери своего бота
3. Введи название приложения
4. Введи описание
5. Загрузи иконку (512x512 px)
6. Отправь GIF или фото для демонстрации
7. **Введи URL твоего приложения:**
   - Для локальной разработки с HTTPS: `https://localhost:5173`
   - Для продакшена: твой домен (например, `https://sharity-web.vercel.app`)
8. Выбери short name (например, `sharity`)

### Шаг 3: Тестирование локально

#### Вариант A: С ngrok (рекомендуется)
```bash
# Установи ngrok
brew install ngrok  # macOS
# или скачай с https://ngrok.com

# Запусти приложение
npm run dev

# В другом терминале запусти ngrok
ngrok http 5173

# Используй HTTPS URL от ngrok в настройках Web App
```

#### Вариант B: С localtunnel
```bash
# Установи localtunnel
npm install -g localtunnel

# Запусти приложение
npm run dev

# В другом терминале
lt --port 5173

# Используй полученный URL в настройках Web App
```

### Шаг 4: Открыть Mini App
1. Открой своего бота в Telegram
2. Нажми кнопку "Menu" или "Открыть приложение"
3. Твой Mini App откроется!

## Доступные данные пользователя:

```typescript
interface TelegramUser {
  id: number;              // Уникальный ID пользователя
  first_name: string;      // Имя
  last_name?: string;      // Фамилия (опционально)
  username?: string;       // Username (опционально)
  language_code?: string;  // Язык (например, "ru")
  photo_url?: string;      // URL аватара (опционально)
}
```

## Примеры использования:

### В компоненте:
```typescript
import { useTelegram } from "@/hooks/useTelegram";

const MyComponent = () => {
  const { user, showAlert, hapticFeedback } = useTelegram();

  const handleClick = () => {
    hapticFeedback.impact("medium");
    showAlert(`Привет, ${user?.first_name}!`);
  };

  return (
    <div>
      <h1>Привет, {user?.first_name}!</h1>
      <button onClick={handleClick}>Показать алерт</button>
    </div>
  );
};
```

### Кнопка "Назад":
```typescript
const { showBackButton, hideBackButton } = useTelegram();

useEffect(() => {
  showBackButton(() => {
    navigate(-1);
  });

  return () => hideBackButton();
}, []);
```

### Main Button (кнопка внизу Telegram):
```typescript
const { showMainButton, hideMainButton } = useTelegram();

useEffect(() => {
  showMainButton("Купить", () => {
    // Обработка покупки
  });

  return () => hideMainButton();
}, []);
```

## Режим разработки:

В режиме разработки (когда Telegram недоступен), хук автоматически использует mock данные:
```typescript
{
  id: 12345678,
  first_name: "Test",
  last_name: "User",
  username: "testuser",
  language_code: "ru"
}
```

## Полезные ссылки:

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Web Apps Documentation](https://core.telegram.org/bots/webapps)
- [Web Apps Examples](https://github.com/Telegram-Web-Apps)
