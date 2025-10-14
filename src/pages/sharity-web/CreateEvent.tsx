import type { FC } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import { useRequestCreateEvent } from "@/hooks/useRequestCreateEvent";
import { testConnection, uploadFiles, PRODUCTS_BUCKET } from "@/lib/minio";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import EventCard from "@/components/EventCard";
import DatePicker from "@/components/DatePicker";

type StepType = "basic" | "photos" | "details" | "review";

const CreateEvent: FC = () => {
  const [currentStep, setCurrentStep] = useState<StepType>("basic");
  const [date, setDate] = useState<Date>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [eventName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const navigate = useNavigate();

  const { createEvent, isLoading: isCreating } = useRequestCreateEvent();

  // Тестируем подключение к Minio при загрузке компонента
  useEffect(() => {
    const testMinioConnection = async () => {
      console.log("Проверяем подключение к Minio...");
      const isConnected = await testConnection();
      console.log("Результат подключения:", isConnected);
    };
    testMinioConnection();
  }, []);

  const steps: Array<{ id: StepType; title: string; description: string }> = [
    {
      id: "basic",
      title: "Основная информация",
      description: "Заголовок, дата, локация",
    },
    { id: "photos", title: "Изображение", description: "Добавьте изображение" },
    {
      id: "details",
      title: "Описание",
      description: "Подробное описание события, ссылка",
    },
    {
      id: "review",
      title: "Предпросмотр",
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
    } else {
      // Публикация товара
      handlePublish();
    }
  };

  const handlePublish = async () => {
    try {
      let imagesArray: string[] = [];

      // Загружаем изображения в S3, если они выбраны
      if (selectedFiles.length > 0) {
        console.log(
          `Загружаем ${selectedFiles.length} изображений в Object Storage...`,
        );
        imagesArray = await uploadFiles(PRODUCTS_BUCKET, selectedFiles);
        console.log("Все изображения загружены:", imagesArray);
      }

      const eventData = {
        name: eventName.trim(),
        date: date || new Date(),
        time: "8-00",
        url: "",
        description: description.trim() || undefined,
        isFavorite: false,
        location: "string",
        imagesArray: imagesArray.length > 0 ? imagesArray : undefined,
      };

      const result = await createEvent(eventData);

      if (result.success) {
        alert("Успешно добавлено!");
        navigate("/classes");
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      console.error("Ошибка при создании:", error);
      alert(`Ошибка при загрузке изображений: ${error}`);
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
          height: 64,
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
            Размещение: Событие
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
          position: "relative",
          width: "100%",
          padding: "16px 16px 100px",
          height: "calc(100vh - 290px)",
          overflowY: "auto",
          backgroundColor: colors.background,
        }}
      >
        {currentStep === "basic" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <TextField
              label="Заголовок *"
              placeholder="Введите заголовок"
              value={eventName}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
              variant="outlined"
            />

            <DatePicker
              label="Дата события *"
              value={date}
              onChange={setDate}
              placeholder="Выберите дату события"
              minDate={new Date()}
            />

            <div>
              <TextField
                label="Локация/адрес *"
                placeholder="Введите локацию/адрес"
                value={eventName}
                onChange={(e) => setCourseName(e.target.value)}
                fullWidth
                variant="outlined"
              />
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
                  margin: "0 0 16px",
                  fontSize: 14,
                  color: colors.lightText,
                }}
              >
                Выберите фотографии
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
              label="Описание"
              placeholder="Опишите подробно"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={6}
              fullWidth
              variant="outlined"
            />
          </div>
        )}

        {currentStep === "review" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.text,
                  margin: "0 0 8px",
                }}
              >
                Предпросмотр объявления
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: colors.lightText,
                  margin: 0,
                }}
              >
                Проверьте, как будет выглядеть ваше объявление
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <EventCard
                image={
                  selectedFiles.length > 0
                    ? URL.createObjectURL(selectedFiles[0])
                    : "https://picsum.photos/600?preview"
                }
                date={
                  date
                    ? date.toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : ""
                }
                time=""
                title={eventName}
                location=""
                id="preview"
              />
            </div>

            {description && (
              <div
                style={{
                  padding: 16,
                  backgroundColor: colors.surfaceColor,
                  borderRadius: 12,
                  marginTop: 8,
                }}
              >
                <h4
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: colors.text,
                    margin: "0 0 8px",
                  }}
                >
                  Описание
                </h4>
                <p
                  style={{
                    fontSize: 14,
                    color: colors.text,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {description}
                </p>
              </div>
            )}

            {selectedFiles.length > 1 && (
              <div
                style={{
                  padding: 16,
                  backgroundColor: colors.surfaceColor,
                  borderRadius: 12,
                }}
              >
                <h4
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: colors.text,
                    margin: "0 0 12px",
                  }}
                >
                  Дополнительные фото ({selectedFiles.length - 1})
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
                    gap: 8,
                  }}
                >
                  {selectedFiles.slice(1).map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Photo ${index + 2}`}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
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
        <Button
          size="large"
          fullWidth
          variant="contained"
          onClick={handleNext}
          disabled={isCreating}
        >
          {currentStepIndex === steps.length - 1
            ? isCreating
              ? "Публикуем..."
              : "Опубликовать"
            : "Далее"}
        </Button>
      </div>
    </section>
  );
};

export default CreateEvent;
