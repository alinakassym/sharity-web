import type { FC } from "react";
import { TextField } from "@mui/material";
import { CustomTextField } from "@/components/CustomTextField";

interface StepEventDetailsProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  url: string;
  onUrlChange: (value: string) => void;
}

export const StepEventDetails: FC<StepEventDetailsProps> = ({
  description,
  onDescriptionChange,
  url,
  onUrlChange,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CustomTextField
        maxSymbols={1000}
        label="Описание"
        placeholder="Опишите подробно"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        multiline
        rows={6}
        fullWidth
        variant="outlined"
      />
      <TextField
        label="Ссылка на источник"
        placeholder="Вставьте ссылку"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        fullWidth
        variant="outlined"
      />
    </div>
  );
};
