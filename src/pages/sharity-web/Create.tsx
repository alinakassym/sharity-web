import type { FC } from "react";
import { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/VuesaxIcon";
import { Stepper, Step, StepLabel } from "@mui/material";

type StepType = "basic" | "photos" | "details" | "review";

const Create: FC = () => {
  const [currentStep, setCurrentStep] = useState<StepType>("basic");
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
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div style={{ textAlign: "center", marginTop: 16 }}>
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
          padding: 16,
          height: "calc(100vh - 64px - 120px - 80px)",
          overflowY: "auto",
          backgroundColor: colors.background,
        }}
      >
        {currentStep === "basic" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Название товара *
              </label>
              <input
                type="text"
                placeholder="Введите название товара"
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: colors.controlColor,
                  color: colors.text,
                  fontSize: 16,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Категория *
              </label>
              <select
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: colors.controlColor,
                  color: colors.text,
                  fontSize: 16,
                  boxSizing: "border-box",
                }}
              >
                <option value="">Выберите категорию</option>
                <option value="gym">Гимнастика</option>
                <option value="dance">Танцы</option>
                <option value="ballet">Балет</option>
                <option value="volley">Волейбол</option>
                <option value="tennis">Теннис</option>
                <option value="football">Футбол</option>
                <option value="hockey">Хоккей</option>
                <option value="run">Бег</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Цена *
              </label>
              <input
                type="number"
                placeholder="0"
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: colors.controlColor,
                  color: colors.text,
                  fontSize: 16,
                  boxSizing: "border-box",
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: colors.lightText,
                  marginTop: 4,
                  display: "block",
                }}
              >
                Укажите цену в тенге
              </span>
            </div>
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
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Описание товара
              </label>
              <textarea
                placeholder="Опишите товар подробно: состояние, размер, особенности..."
                rows={6}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: colors.controlColor,
                  color: colors.text,
                  fontSize: 16,
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Состояние
              </label>
              <select
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: colors.controlColor,
                  color: colors.text,
                  fontSize: 16,
                  boxSizing: "border-box",
                }}
              >
                <option value="">Выберите состояние</option>
                <option value="new">Новое</option>
                <option value="excellent">Отличное</option>
                <option value="good">Хорошее</option>
                <option value="satisfactory">Удовлетворительное</option>
              </select>
            </div>
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
          padding: 16,
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.surfaceColor}`,
          display: "flex",
          gap: 12,
        }}
      >
        {currentStepIndex > 0 && (
          <button
            onClick={handleBack}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.background,
              color: colors.text,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Назад
          </button>
        )}
        <button
          onClick={handleNext}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 12,
            border: "none",
            backgroundColor: colors.primary,
            color: colors.lighter,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {currentStepIndex === steps.length - 1 ? "Опубликовать" : "Далее"}
        </button>
      </div>
    </section>
  );
};

export default Create;
