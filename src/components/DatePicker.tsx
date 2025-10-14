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
            textAlign: "left",
            alignSelf: "flex-start",
            color: colors.text,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.primary;
            e.target.style.borderWidth = "3";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.border;
            e.target.style.borderWidth = "1";
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
