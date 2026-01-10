// sharity-web/src/components/CustomSelect.tsx

import type { FC, RefObject } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  FormHelperText,
} from "@mui/material";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  searchable?: boolean; // Включить возможность поиска
  inputRef?: RefObject<HTMLInputElement | null>;
  error?: boolean; // Флаг наличия ошибки
  helperText?: string; // Текст ошибки или подсказки
}

/**
 * Переиспользуемый компонент Select на основе MUI
 * Используется для всех выпадающих списков в приложении
 * Поддерживает поиск при установке searchable={true}
 */
const CustomSelect: FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Выберите значение",
  disabled = false,
  fullWidth = true,
  required = false,
  searchable = false,
  inputRef,
  error = false,
  helperText,
}) => {
  const displayLabel = required ? `${label} *` : label;

  // Если включен поиск, используем Autocomplete
  if (searchable) {
    // Находим выбранную опцию по значению
    const selectedOption = options.find((opt) => opt.value === value) || null;

    return (
      <Autocomplete
        fullWidth={fullWidth}
        disabled={disabled}
        options={options}
        value={selectedOption}
        onChange={(_, newValue) => {
          onChange(newValue ? newValue.value : "");
        }}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        noOptionsText="Ничего не найдено"
        renderInput={(params) => (
          <TextField
            {...params}
            label={displayLabel}
            placeholder={placeholder}
            inputRef={inputRef}
            error={error}
            helperText={helperText}
          />
        )}
      />
    );
  }

  // Обычный Select без поиска
  return (
    <FormControl fullWidth={fullWidth} disabled={disabled} error={error}>
      <InputLabel>{displayLabel}</InputLabel>
      <Select
        value={value}
        label={displayLabel}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
