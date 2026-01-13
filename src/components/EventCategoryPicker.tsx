import type { FC } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

export type EventCategory =
  | "Турниры"
  | "Конкурсы"
  | "Мастер-классы"
  | "Развлечения"
  | "Другое";

interface EventCategoryPickerProps {
  value: EventCategory | string;
  onChange: (category: EventCategory | string) => void;
  customValue?: string;
  onCustomValueChange?: (value: string) => void;
  label?: string;
}

const EventCategoryPicker: FC<EventCategoryPickerProps> = ({
  value,
  onChange,
  customValue = "",
  onCustomValueChange,
  label = "Категория события *",
}) => {
  const categories: EventCategory[] = [
    "Турниры",
    "Конкурсы",
    "Мастер-классы",
    "Развлечения",
    "Другое",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value as EventCategory)}
          label={label}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {value === "Другое" && (
        <TextField
          label="Укажите категорию"
          placeholder="Введите свою категорию"
          value={customValue}
          onChange={(e) => onCustomValueChange?.(e.target.value)}
          fullWidth
          variant="outlined"
        />
      )}
    </div>
  );
};

export default EventCategoryPicker;
