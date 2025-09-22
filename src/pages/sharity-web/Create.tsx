import type { FC } from "react";
import { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/VuesaxIcon";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";

type StepType = "basic" | "photos" | "details" | "review";

const Create: FC = () => {
  const [currentStep, setCurrentStep] = useState<StepType>("basic");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const steps: Array<{ id: StepType; title: string; description: string }> = [
    {
      id: "basic",
      title: "Основная информация",
      description: "Название, категория, цена",
    },
    { id: "photos", title: "Фотографии", description: "Добавьте фото товара" },
    {
      id: "details",
      title: "Описание",
      description: "Подробное описание товара",
    },
    {
      id: "review",
      title: "Проверка",
      description: "Проверьте данные перед публикацией",
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    } else {
      window.history.back();
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArray = Array.from(files);
      // Фильтруем только изображения
      const imageFiles = filesArray.filter((file) =>
        file.type.startsWith("image/"),
      );
      setSelectedFiles([...selectedFiles, ...imageFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(
      selectedFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <section style={{ position: "fixed", left: 0, right: 0 }}>
      {/* Header */}
      <div
        style={{
          paddingLeft: 16,
          paddingRight: 56,
          paddingBottom: 8,
          height: 48,
          display: "flex",
          flex: 1,
          alignItems: "center",
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          borderBottomColor: colors.surfaceColor,
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: colors.text,
              margin: 0,
            }}
          >
            Размещение: Продажа
          </h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          padding: "16px 16px 8px",
          backgroundColor: colors.background,
        }}
      >
        <Stepper activeStep={currentStepIndex} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel></StepLabel>
            </Step>
          ))}
        </Stepper>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.lightText,
              margin: 0,
            }}
          >
            {steps[currentStepIndex].title}
          </p>
          <p
            style={{
              fontSize: 14,
              color: colors.lightText,
              margin: 0,
            }}
          >
            {steps[currentStepIndex].description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "16px 16px 100px",
          height: "calc(100vh - 290px)",
          overflowY: "auto",
          backgroundColor: colors.background,
        }}
      >
        {currentStep === "basic" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label="Название товара *"
              placeholder="Введите название товара"
              fullWidth
              variant="outlined"
            />

            <FormControl fullWidth>
              <InputLabel>Категория *</InputLabel>
              <Select
                value={category}
                label="Категория *"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">
                  <em>Выберите категорию</em>
                </MenuItem>
                <MenuItem value="gym">Гимнастика</MenuItem>
                <MenuItem value="dance">Танцы</MenuItem>
                <MenuItem value="ballet">Балет</MenuItem>
                <MenuItem value="volley">Волейбол</MenuItem>
                <MenuItem value="tennis">Теннис</MenuItem>
                <MenuItem value="football">Футбол</MenuItem>
                <MenuItem value="hockey">Хоккей</MenuItem>
                <MenuItem value="run">Бег</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Цена *"
              placeholder="0"
              type="number"
              inputMode="numeric"
              inputProps={{ pattern: "[0-9]*" }}
              fullWidth
              variant="outlined"
              helperText="Укажите цену в тенге"
            />
          </div>
        )}

        {currentStep === "photos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                border: `2px dashed ${colors.border}`,
                borderRadius: 12,
                padding: 32,
                textAlign: "center",
                backgroundColor: colors.surfaceColor,
              }}
            >
              <VuesaxIcon name="camera" color={colors.lightText} size={48} />
              <p
                style={{
                  margin: "16px 0 8px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.text,
                }}
              >
                Добавьте фотографии
              </p>
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: 14,
                  color: colors.lightText,
                }}
              >
                Выберите фотографии товара
              </p>
              <Button
                component="label"
                variant="contained"
                startIcon={
                  <VuesaxIcon name="camera" color={colors.lighter} size={20} />
                }
              >
                Выбрать фото
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: 16,
                    color: colors.text,
                  }}
                >
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
                        backgroundColor: colors.controlColor,
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        onClick={() => removeFile(index)}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          borderColor: colors.error,
                          borderWidth: 1,
                          borderStyle: "solid",
                          boxSizing: "content-box",
                          backgroundColor: `${colors.error}40`,
                        }}
                      >
                        <VuesaxIcon
                          name="close"
                          size={6}
                          color={colors.error}
                        />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === "details" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label="Описание товара"
              placeholder="Опишите товар подробно: состояние, размер, особенности..."
              multiline
              rows={6}
              fullWidth
              variant="outlined"
            />

            <FormControl fullWidth>
              <InputLabel>Состояние</InputLabel>
              <Select
                value={condition}
                label="Состояние"
                onChange={(e) => setCondition(e.target.value)}
              >
                <MenuItem value="">
                  <em>Выберите состояние</em>
                </MenuItem>
                <MenuItem value="new">Новое</MenuItem>
                <MenuItem value="excellent">Отличное</MenuItem>
                <MenuItem value="good">Хорошее</MenuItem>
                <MenuItem value="satisfactory">Удовлетворительное</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}

        {currentStep === "review" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p
              style={{
                fontSize: 16,
                color: colors.text,
                textAlign: "center",
                margin: 0,
              }}
            >
              Проверьте данные перед публикацией
            </p>
            {/* Здесь будет превью товара */}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: 8,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.surfaceColor}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {currentStepIndex > 0 && (
          <Button
            size="large"
            fullWidth={true}
            variant="outlined"
            onClick={handleBack}
          >
            Назад
          </Button>
        )}
        <Button size="large" fullWidth variant="contained" onClick={handleNext}>
          {currentStepIndex === steps.length - 1 ? "Опубликовать" : "Далее"}
        </Button>
      </div>
    </section>
  );
};

export default Create;
