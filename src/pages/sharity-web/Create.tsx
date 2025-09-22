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
} from "@mui/material";

type StepType = "basic" | "photos" | "details" | "review";

const Create: FC = () => {
  const [currentStep, setCurrentStep] = useState<StepType>("basic");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
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

  return (
    <section style={{ position: "fixed", left: 0, right: 0 }}>
      {/* Header */}
      <div
        style={{
          height: 56,
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.surfaceColor}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 16,
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
            Размещение "Продажа"
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
          height: "100%",
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
                  margin: 0,
                  fontSize: 14,
                  color: colors.lightText,
                }}
              >
                Нажмите, чтобы выбрать файлы или перетащите их сюда
              </p>
            </div>
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
          height: 84,
          bottom: 0,
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
          <Button fullWidth={true} variant="outlined" onClick={handleBack}>
            Назад
          </Button>
        )}
        <Button fullWidth variant="contained" onClick={handleNext}>
          {currentStepIndex === steps.length - 1 ? "Опубликовать" : "Далее"}
        </Button>
      </div>
    </section>
  );
};

export default Create;
