import type { FC } from "react";
import { Button, IconButton } from "@mui/material";
import VuesaxIcon from "@/components/icons/VuesaxIcon";

type ColorsShape = {
  surfaceColor: string;
  border: string;
  controlColor: string;
  lightText: string;
  text: string;
  lighter: string;
  error: string;
};

interface StepCoursePhotosProps {
  c: ColorsShape;
  selectedFiles: File[];
  filePreviews: Array<{ file: File; url: string }>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export const StepCoursePhotos: FC<StepCoursePhotosProps> = ({
  c,
  selectedFiles,
  filePreviews,
  onFileChange,
  onRemoveFile,
}) => {
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
        <VuesaxIcon name="camera" color={c.lightText} size={48} />
        <p
          style={{
            margin: "16px 0 8px",
            fontSize: 16,
            fontWeight: 600,
            color: c.text,
          }}
        >
          Добавьте фотографии
        </p>
        <p style={{ margin: "0 0 16px", fontSize: 14, color: c.lightText }}>
          Выберите фотографии курса
        </p>

        <Button
          component="label"
          variant="contained"
          startIcon={<VuesaxIcon name="camera" color={c.lighter} size={20} />}
        >
          Выбрать фото
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onFileChange}
          />
        </Button>
      </div>

      {selectedFiles.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 16, color: c.text }}>
            Выбранные изображения ({selectedFiles.length}):
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
              gap: 8,
            }}
          >
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  overflow: "hidden",
                  backgroundColor: c.controlColor,
                }}
              >
                <img
                  src={filePreviews[index]?.url}
                  alt={file.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                <IconButton
                  onClick={() => onRemoveFile(index)}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
