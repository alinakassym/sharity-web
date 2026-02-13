import type { FC } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

export type EventType =
  | "Турниры"
  | "Конкурсы"
  | "Мастер-классы"
  | "Развлечения"
  | "Другое";

const eventTypes: EventType[] = [
  "Турниры",
  "Конкурсы",
  "Мастер-классы",
  "Развлечения",
  "Другое",
];

interface EventTypePickerProps {
  value: EventType | string;
  onChange: (eventType: EventType | string) => void;
  customValue?: string;
  onCustomValueChange?: (value: string) => void;
  label?: string;
}

const EventTypePicker: FC<EventTypePickerProps> = ({
  value,
  onChange,
  customValue = "",
  onCustomValueChange,
  label = "Тип события *",
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value as EventType)}
          label={label}
        >
          {eventTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {value === "Другое" && (
        <TextField
          label="Укажите тип события"
          placeholder="Введите свой тип события"
          value={customValue}
          onChange={(e) => onCustomValueChange?.(e.target.value)}
          fullWidth
          variant="outlined"
        />
      )}
    </div>
  );
};

export default EventTypePicker;
