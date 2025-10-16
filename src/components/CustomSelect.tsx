import type { FC } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

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
}

/**
 * Переиспользуемый компонент Select на основе MUI
 * Используется для всех выпадающих списков в приложении
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
}) => {
  const displayLabel = required ? `${label} *` : label;

  return (
    <FormControl fullWidth={fullWidth} disabled={disabled}>
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
    </FormControl>
  );
};

export default CustomSelect;
