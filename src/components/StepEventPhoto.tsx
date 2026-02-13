import type { FC } from "react";
import { Button, IconButton } from "@mui/material";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

interface StepEventPhotoProps {
  selectedFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

export const StepEventPhoto: FC<StepEventPhotoProps> = ({
  selectedFile,
  onFileChange,
  onRemoveFile,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          border: `2px dashed ${c.border}`,
          borderRadius: 12,
          padding: 32,
          textAlign: "center",
          backgroundColor: c.surfaceColor,
        }}
      >
        <VuesaxIcon
          name="gallery"
          stroke={c.lightText}
          strokeWidth={1.5}
          size={32}
        />
        <p
          style={{
            margin: "16px 0 8px",
            fontSize: 16,
            fontWeight: 600,
            color: c.text,
          }}
        >
          Добавьте изображение/фото
        </p>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 14,
            color: c.lightText,
          }}
        >
          Выберите изображение
        </p>
        <Button
          component="label"
          variant="contained"
          startIcon={<VuesaxIcon name="camera" color={c.lighter} size={20} />}
        >
          Выбрать
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={onFileChange}
          />
        </Button>
      </div>

      {selectedFile && (
        <div style={{ marginTop: 16 }}>
          <h3
            style={{
              margin: "0 0 12px",
              fontSize: 16,
              color: c.text,
            }}
          >
            Выбранное изображение:
          </h3>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 200,
              height: 200,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: c.controlColor,
            }}
          >
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <IconButton
              onClick={onRemoveFile}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                borderColor: c.error,
                borderWidth: 1,
                borderStyle: "solid",
                boxSizing: "content-box",
                backgroundColor: `${c.error}40`,
              }}
            >
              <VuesaxIcon name="close" size={6} color={c.error} />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};
