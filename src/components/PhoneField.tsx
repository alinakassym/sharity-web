// src/components/PhoneField.tsx

import type { FC } from "react";
import { forwardRef } from "react";
import { TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { IMaskInput } from "react-imask";

/** Полный номер = 11 цифр (7 + 10 цифр номера) */
export const isPhoneComplete = (value: string): boolean =>
  value.replace(/\D/g, "").length === 11;

interface PhoneMaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PhoneMask = forwardRef<HTMLInputElement, PhoneMaskProps>(
  function PhoneMask(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="+7 (000) 000-00-00"
        definitions={{
          "0": /[0-9]/,
        }}
        inputRef={ref}
        onAccept={(value: unknown) =>
          onChange({ target: { name: props.name, value: value as string } })
        }
        overwrite
      />
    );
  },
);

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

const PhoneField: FC<PhoneFieldProps> = ({
  value,
  onChange,
  label = "Телефон",
  error,
  helperText,
  fullWidth,
  sx,
}) => (
  <TextField
    label={label}
    placeholder="+7 (___) ___-__-__"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth={fullWidth}
    variant="outlined"
    error={error}
    helperText={helperText}
    slotProps={{
      input: {
        inputComponent: PhoneMask as never,
      },
    }}
    sx={sx}
  />
);

export default PhoneField;
