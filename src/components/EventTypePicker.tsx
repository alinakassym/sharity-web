import type { FC } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";

interface EventTypeOption {
  value: string;
  label: string;
}

interface EventTypePickerProps {
  value: string;
  onChange: (eventType: string) => void;
  eventTypes: EventTypeOption[];
  isLoading?: boolean;
  customValue?: string;
  onCustomValueChange?: (value: string) => void;
  label?: string;
}

const EventTypePicker: FC<EventTypePickerProps> = ({
  value,
  onChange,
  eventTypes,
  isLoading = false,
  customValue = "",
  onCustomValueChange,
  label = "Тип события *",
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          label={label}
        >
          {eventTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
          <MenuItem value="Другое">Другое</MenuItem>
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
