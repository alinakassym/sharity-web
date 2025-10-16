# CustomSelect Component

Переиспользуемый компонент выпадающего списка на основе MUI с поддержкой поиска.

## Интерфейс

```typescript
export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;              // Метка поля
  value: string;              // Текущее значение
  onChange: (value: string) => void;  // Функция обработки изменения
  options: SelectOption[];    // Массив опций
  placeholder?: string;       // Текст placeholder (по умолчанию "Выберите значение")
  disabled?: boolean;         // Отключить компонент (по умолчанию false)
  fullWidth?: boolean;        // Растянуть на всю ширину (по умолчанию true)
  required?: boolean;         // Обязательное поле, добавляет * к метке (по умолчанию false)
  searchable?: boolean;       // Включить поиск (по умолчанию false)
}
```

## Примеры использования

### Обычный Select (без поиска)

```tsx
import CustomSelect from "@/components/CustomSelect";
import { useState } from "react";

const MyComponent = () => {
  const [condition, setCondition] = useState("");

  return (
    <CustomSelect
      label="Состояние"
      value={condition}
      onChange={setCondition}
      options={[
        { value: "Новое", label: "Новое" },
        { value: "Отличное", label: "Отличное" },
        { value: "Хорошее", label: "Хорошее" },
        { value: "Удовлетворительное", label: "Удовлетворительное" },
      ]}
      placeholder="Выберите состояние"
    />
  );
};
```

### Select с поиском

Полезно для больших списков опций (категории, города, и т.д.):

```tsx
import CustomSelect from "@/components/CustomSelect";
import { useState } from "react";

const MyComponent = () => {
  const [category, setCategory] = useState("");

  return (
    <CustomSelect
      label="Категория"
      value={category}
      onChange={setCategory}
      options={[
        { value: "Футбол", label: "Футбол" },
        { value: "Баскетбол", label: "Баскетбол" },
        { value: "Волейбол", label: "Волейбол" },
        { value: "Теннис", label: "Теннис" },
        { value: "Хоккей", label: "Хоккей" },
        // ... много других категорий
      ]}
      placeholder="Выберите категорию"
      searchable  // Включаем поиск
      required
    />
  );
};
```

### Select с динамической загрузкой данных

```tsx
import CustomSelect from "@/components/CustomSelect";
import { useState } from "react";
import { useRequestGetCategories } from "@/hooks/useRequestGetCategories";

const MyComponent = () => {
  const [category, setCategory] = useState("");
  const { categories, isLoading } = useRequestGetCategories();

  return (
    <CustomSelect
      label="Категория"
      value={category}
      onChange={setCategory}
      options={categories.map((cat) => ({
        value: cat.name_ru,
        label: cat.name_ru,
      }))}
      placeholder={
        isLoading ? "Загрузка категорий..." : "Выберите категорию"
      }
      disabled={isLoading}
      required
      searchable
    />
  );
};
```

### Select с пользовательским placeholder

```tsx
<CustomSelect
  label="Город"
  value={city}
  onChange={setCity}
  options={cityOptions}
  placeholder="Начните вводить название города..."
  searchable
/>
```

### Отключенный Select

```tsx
<CustomSelect
  label="Статус"
  value={status}
  onChange={setStatus}
  options={statusOptions}
  disabled={true}
/>
```

### Select с фиксированной шириной

```tsx
<CustomSelect
  label="Тип"
  value={type}
  onChange={setType}
  options={typeOptions}
  fullWidth={false}  // Отключаем растягивание на всю ширину
/>
```

## Поведение

### Без поиска (searchable={false} или не указан)

- Использует стандартный MUI Select
- Клик открывает выпадающий список
- Можно выбрать значение кликом
- Можно использовать стрелки на клавиатуре для навигации

### С поиском (searchable={true})

- Использует MUI Autocomplete
- Клик в поле открывает список и фокусирует поле ввода
- Можно вводить текст для фильтрации опций
- Фильтрация работает по label (нечувствительна к регистру)
- Показывает "Ничего не найдено" если нет совпадений
- Можно очистить значение кнопкой X
- Поддерживает навигацию стрелками на клавиатуре

## Стилизация

Компонент использует стандартные стили MUI и автоматически подстраивается под текущую тему приложения.

## Когда использовать searchable?

**Используйте searchable={true} когда:**
- Список содержит более 10-15 опций
- Пользователю нужно быстро найти конкретное значение
- Названия опций длинные или похожие

**Не используйте searchable когда:**
- Список содержит мало опций (3-7)
- Все опции легко просмотреть визуально
- Нужна максимальная простота интерфейса

## Примеры из проекта

### Create.tsx - Select с поиском для категорий

```tsx
<CustomSelect
  label="Категория"
  value={category}
  onChange={setCategory}
  options={categoryOptions.map((cat) => ({
    value: cat.name_ru,
    label: cat.name_ru,
  }))}
  placeholder={
    isLoadingCategories
      ? "Загрузка категорий..."
      : "Выберите категорию"
  }
  disabled={isLoadingCategories}
  required
  searchable  // Много категорий - включаем поиск
/>
```

### Create.tsx - Select без поиска для состояния

```tsx
<CustomSelect
  label="Состояние"
  value={condition}
  onChange={setCondition}
  options={[
    { value: "Новое", label: "Новое" },
    { value: "Отличное", label: "Отличное" },
    { value: "Хорошее", label: "Хорошее" },
    { value: "Удовлетворительное", label: "Удовлетворительное" },
  ]}
  placeholder="Выберите состояние"
  // searchable не указан - обычный Select для 4 опций
/>
```
