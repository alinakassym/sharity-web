import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  label?: string;
  placeholder?: string;
}

const TimePicker: FC<TimePickerProps> = ({
  value = "",
  onChange,
  label = "Время",
  placeholder = "00:00",
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const formatTimeInput = (input: string): string => {
    // Удаляем все кроме цифр
    const numbers = input.replace(/\D/g, "");

    // Если пусто, возвращаем пустую строку
    if (numbers.length === 0) return "";

    // Форматируем в HH:MM
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
    }

    // Ограничиваем до 4 цифр (HH:MM)
    return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
  };

  const validateTime = (timeStr: string): boolean => {
    if (!timeStr || timeStr.length !== 5) return false;

    const [hours, minutes] = timeStr.split(":").map(Number);

    // Проверяем валидность часов (0-23) и минут (0-59)
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatTimeInput(inputValue);

    // Обновляем значение даже если оно неполное
    onChange(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем: backspace, delete, tab, escape, enter, стрелки
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "Escape" ||
      e.key === "Enter" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      return;
    }

    // Разрешаем только цифры
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    // При потере фокуса проверяем корректность введённого времени
    if (value && !validateTime(value)) {
      // Если время некорректное, можно очистить или оставить как есть
      // Оставляем как есть, чтобы пользователь мог исправить
    }
  };

  return (
    <div style={{ position: "relative", overflow: "visible" }}>
      {label && (
        <label
          style={{
            position: "absolute",
            top: -16,
            left: 14,
            padding: 6,
            fontSize: 12,
            fontWeight: 500,
            color: colors.text,
            paddingLeft: 4,
            backgroundColor: colors.background,
            zIndex: 20,
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          backgroundColor: colors.background,
          borderColor: colors.muiBorder,
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 20,
          zIndex: 2,
        }}
      >
        <input
          type="text"
          value={value}
          onChange={handleTimeChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={5}
          style={{
            width: "100%",
            height: 56,
            padding: "0 48px 0 16px",
            fontSize: 16,
            fontWeight: 400,
            textAlign: "left",
            alignSelf: "flex-start",
            color: colors.text,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          <VuesaxIcon name="clock" size={24} color={colors.lightText} />
        </div>
      </div>
      {value && !validateTime(value) && value.length > 0 && (
        <p
          style={{
            margin: "4px 0 0 14px",
            fontSize: 12,
            color: colors.error,
          }}
        >
          Введите корректное время (00:00 - 23:59)
        </p>
      )}
    </div>
  );
};

export default TimePicker;
