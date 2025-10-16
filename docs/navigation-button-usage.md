# NavigationButton Component

Переиспользуемая кнопка навигации с текстом и стрелкой. Используется для переходов между страницами.

## Интерфейс

```typescript
interface NavigationButtonProps {
  label: string;              // Текст кнопки
  onClick: () => void;        // Функция обработки клика
  icon?: string;              // Имя иконки VuesaxIcon (по умолчанию "arrow-right")
  iconSize?: number;          // Размер иконки (по умолчанию 24)
  leftIcon?: ReactNode;       // Опциональная иконка слева от текста
  disabled?: boolean;         // Отключить кнопку (по умолчанию false)
}
```

## Внешний вид

- Фон: `c.surfaceColor`
- Скругление: `20px`
- Отступы: `20px`
- Hover эффект: снижение opacity до 0.8
- Transition: плавная анимация opacity (0.2s)

## Примеры использования

### Базовое использование

```tsx
import NavigationButton from "@/components/NavigationButton";
import { useNavigate } from "react-router-dom";

const MyComponent = () => {
  const navigate = useNavigate();

  return (
    <NavigationButton
      label="Мои публикации"
      onClick={() => navigate("/my-publications")}
    />
  );
};
```

### С пользовательской иконкой

```tsx
<NavigationButton
  label="Настройки"
  onClick={handleOpenSettings}
  icon="setting"  // Любая иконка из VuesaxIcon
/>
```

### С иконкой другого размера

```tsx
<NavigationButton
  label="Профиль"
  onClick={handleOpenProfile}
  icon="user"
  iconSize={28}  // Увеличенный размер иконки
/>
```

### С иконкой слева

```tsx
import VuesaxIcon from "@/components/icons/VuesaxIcon";

<NavigationButton
  label="Пользователи"
  onClick={handleOpenUsers}
  leftIcon={<VuesaxIcon name="people" size={24} color={c.primary} />}
/>
```

### С несколькими элементами слева

```tsx
<NavigationButton
  label="Уведомления"
  onClick={handleOpenNotifications}
  leftIcon={
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <VuesaxIcon name="notification" size={24} color={c.primary} />
      <div
        style={{
          backgroundColor: c.error,
          color: "white",
          borderRadius: "50%",
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
        }}
      >
        3
      </div>
    </div>
  }
/>
```

### Отключенная кнопка

```tsx
<NavigationButton
  label="В разработке"
  onClick={() => {}}
  disabled={true}  // Кнопка будет серой и не кликабельной
/>
```

### С условным рендерингом

```tsx
const Profile = () => {
  const { userData } = useCurrentUser();
  const navigate = useNavigate();

  // Показываем только если пользователь авторизован
  return (
    <>
      {userData && (
        <NavigationButton
          label="Мои публикации"
          onClick={() => navigate("/my-publications")}
        />
      )}

      {/* Показываем только для админов */}
      {userData?.role === "admin" && (
        <NavigationButton
          label="Пользователи"
          onClick={() => navigate("/users")}
        />
      )}
    </>
  );
};
```

### Список кнопок

```tsx
const Menu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Магазин", path: "/store", icon: "shop" },
    { label: "Классы", path: "/classes", icon: "book" },
    { label: "Профиль", path: "/profile", icon: "user" },
    { label: "Настройки", path: "/settings", icon: "setting" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {menuItems.map((item) => (
        <NavigationButton
          key={item.path}
          label={item.label}
          onClick={() => navigate(item.path)}
          icon={item.icon}
        />
      ))}
    </div>
  );
};
```

## Стилизация

Компонент автоматически подстраивается под текущую цветовую схему приложения:
- Light mode: светлый фон
- Dark mode: темный фон

Hover эффект работает только для активных (не disabled) кнопок.

## Доступность

- При `disabled={true}`:
  - Курсор меняется на `not-allowed`
  - Opacity снижается до 0.5
  - onClick не вызывается
  - Hover эффект отключен

## Использование в проекте

### Profile.tsx

```tsx
{/* Кнопка перехода к публикациям */}
{userData && (
  <NavigationButton
    label="Мои публикации"
    onClick={handleNavigateToPublications}
  />
)}

{/* Кнопка перехода к пользователям (только для админа) */}
{userData && isAdmin && (
  <NavigationButton
    label="Пользователи"
    onClick={handleNavigateToUsers}
  />
)}
```

## Кастомизация

### Изменение скругления

Если нужно изменить скругление для всех NavigationButton, отредактируйте `borderRadius` в компоненте:

```tsx
// В NavigationButton.tsx
style={{
  borderRadius: 12,  // Было 20
  // ...
}}
```

### Изменение отступов

```tsx
// В NavigationButton.tsx
style={{
  padding: 16,  // Было 20
  // ...
}}
```

### Изменение шрифта

```tsx
// В NavigationButton.tsx
style={{
  fontSize: 16,  // Было 18
  fontWeight: 600,  // Было 700
  // ...
}}
```

## Альтернативы

Если нужна кнопка **без** стрелки справа, используйте стандартный MUI Button:

```tsx
import { Button } from "@mui/material";

<Button variant="contained" onClick={handleClick}>
  Нажми меня
</Button>
```
