import type { FC } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";

interface CategoryOption {
  value: string;
  label: string;
}

interface EventCategoryPickerProps {
  value: string;
  onChange: (category: string) => void;
  categories: CategoryOption[];
  isLoading?: boolean;
  label?: string;
}

const EventCategoryPicker: FC<EventCategoryPickerProps> = ({
  value,
  onChange,
  categories,
  isLoading = false,
  label = "Категория *",
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.value} value={cat.value}>
            {cat.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default EventCategoryPicker;
