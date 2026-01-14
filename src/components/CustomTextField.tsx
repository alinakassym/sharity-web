import type { FC, ReactNode } from "react";
import { TextField as MuiTextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

export type CustomTextFieldProps = TextFieldProps & {
  /** Максимальное количество символов (счётчик + maxLength) */
  maxSymbols?: number;
};

export const CustomTextField: FC<CustomTextFieldProps> = (props) => {
  const { maxSymbols, helperText, value, slotProps, ...rest } = props;

  const valueStr = value == null ? "" : String(value);
  const used = valueStr.length;

  const mergedSlotProps: TextFieldProps["slotProps"] = {
    ...slotProps,
    htmlInput: {
      ...slotProps?.htmlInput,
      ...(typeof maxSymbols === "number" ? { maxLength: maxSymbols } : null),
    },
  };

  const composedHelperText: ReactNode =
    typeof maxSymbols === "number" ? (
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <span>{helperText || "\u00A0"}</span>
        <span style={{ opacity: 0.65, whiteSpace: "nowrap" }}>
          {used}/{maxSymbols}
        </span>
      </div>
    ) : (
      helperText
    );

  return (
    <MuiTextField
      {...rest}
      value={value}
      helperText={composedHelperText}
      slotProps={mergedSlotProps}
    />
  );
};
