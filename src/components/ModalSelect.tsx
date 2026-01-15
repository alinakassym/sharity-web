// src/components/ModalSelect.tsx

import type { FC, RefObject } from "react";
import { useId, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

export interface SelectOption {
  value: string;
  label: string;
}

interface ModalSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  searchable?: boolean; // показывать поиск в модалке
  inputRef?: RefObject<HTMLInputElement | null>;
  error?: boolean;
  helperText?: string;
}

/**
 * Select, который выглядит как обычный MUI Select,
 * но вместо dropdown открывает модальное окно со списком опций и (опционально) поиском.
 */
const ModalSelect: FC<ModalSelectProps> = ({
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
  const scheme = useColorScheme();
  const c = Colors[scheme];

  const uid = useId();
  const labelId = `${uid}-label`;
  const selectId = `${uid}-select`;

  const displayLabel = required ? `${label} *` : label;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) || null,
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query]);

  const handleOpen = () => {
    if (disabled) return;
    setOpen(true);
    setQuery("");
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  const handlePick = (nextValue: string) => {
    onChange(nextValue);
    handleClose();
  };

  return (
    <>
      {/* Внешне — как обычный MUI Select */}
      <FormControl fullWidth={fullWidth} disabled={disabled} error={error}>
        <InputLabel id={labelId}>{displayLabel}</InputLabel>

        <Select
          labelId={labelId}
          id={selectId}
          value={value}
          label={displayLabel}
          // важное: блокируем стандартное раскрытие
          open={false}
          onOpen={(e) => {
            // на всякий случай
            e.preventDefault();
            e.stopPropagation();
            handleOpen();
          }}
          // открываем модалку по клику/маусдауну
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpen();
          }}
          // renderValue чтобы отображать label выбранной опции
          renderValue={(selected) => {
            if (!selected) return <em>{placeholder}</em>;
            return selectedOption?.label ?? String(selected);
          }}
          // чтобы placeholder выглядел как в обычном селекте
        >
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        </Select>

        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>

      {/* Модалка */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{ mt: 7 }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ m: 0 }}>
            {displayLabel}
          </Typography>

          <IconButton aria-label="close" onClick={handleClose} edge="end">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 0, pt: 0, pb: 0 }}>
          {searchable && (
            <Box sx={{ px: 2, my: 0.8 }}>
              <TextField
                fullWidth
                autoFocus
                label="Поиск"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                inputRef={inputRef}
              />
            </Box>
          )}

          <List
            sx={{
              maxHeight: "70vh",
            }}
          >
            {filteredOptions.length === 0 ? (
              <Typography sx={{ p: 2 }} color="text.secondary">
                Ничего не найдено
              </Typography>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;

                return (
                  <ListItemButton
                    key={opt.value}
                    selected={isSelected}
                    onClick={() => handlePick(opt.value)}
                    sx={{
                      mb: 0.5,
                      py: 1.2,
                      px: 3,
                      "& .MuiListItemText-primary": {
                        fontSize: 18,
                        fontWeight: 400,
                        color: c.text,
                      },
                    }}
                  >
                    <ListItemText primary={opt.label} />
                  </ListItemButton>
                );
              })
            )}

            <ListItemButton
              key={"__none__modal_select_reset"}
              onClick={() => handlePick("")}
              sx={{
                pt: 2,
                pb: 2,
                px: 3,
                "& .MuiListItemText-primary": {
                  fontSize: 14,
                  fontWeight: 600,
                  color: "primary.main",
                },
              }}
            >
              <ListItemText primary="Сбросить выбор" />
            </ListItemButton>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalSelect;
