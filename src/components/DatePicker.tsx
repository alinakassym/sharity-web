import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: FC<DatePickerProps> = ({
  value,
  onChange,
  label = "Дата",
  placeholder = "Выберите дату",
  minDate,
  maxDate,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      onChange(new Date(dateValue));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
      }}
    >
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: colors.lightText,
            paddingLeft: 4,
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <input
          type="date"
          value={formatDate(value)}
          onChange={handleDateChange}
          min={minDate ? formatDate(minDate) : undefined}
          max={maxDate ? formatDate(maxDate) : undefined}
          placeholder={placeholder}
          style={{
            width: "100%",
            height: 56,
            padding: "0 48px 0 16px",
            fontSize: 16,
            fontWeight: 400,
            color: colors.text,
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            outline: "none",
            transition: "border-color 0.2s",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.primary;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.border;
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
          <VuesaxIcon name="calendar" size={24} color={colors.lightText} />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
