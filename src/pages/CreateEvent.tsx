import type { FC } from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import { Colors } from "@/theme/colors";
import { getTelegramUser } from "@/lib/telegram";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import { useRequestCreateEvent } from "@/hooks/useRequestCreateEvent";
import { uploadFiles, PRODUCTS_BUCKET } from "@/lib/minio";
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
import TimePicker from "@/components/TimePicker";
import YandexMap from "@/components/YandexMap";
import EventCategoryPicker, {
  type EventCategory,
} from "@/components/EventCategoryPicker";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { CustomTextField } from "@/components/CustomTextField";

type StepType = "basic" | "location" | "photos" | "details" | "review";

const CreateEvent: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const paddingTop = useSafePaddingTop(48, 44);
  const platformName = useSafePlatform();

  const [isPublishing, setIsPublishing] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepType>("basic");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [eventName, setCourseName] = useState("");
  const [location, setLocation] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState<
    [number, number] | undefined
  >();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EventCategory | string>("");
  const [customCategory, setCustomCategory] = useState("");
  const locationInputRef = useRef<HTMLDivElement>(null);

  const { createEvent } = useRequestCreateEvent();

  const steps: Array<{ id: StepType; title: string; description: string }> = [
    {
      id: "basic",
      title: "Основная информация",
      description: "Заголовок, дата, время",
    },
    {
      id: "location",
      title: "Локация",
      description: "Адрес",
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
      setIsPublishing(true);
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

      // Объединяем дату и время в один объект Date
      const eventDateTime = date ? new Date(date) : new Date();
      if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        eventDateTime.setHours(hours, minutes, 0, 0);
      }

      // Определяем итоговую категорию
      const finalCategory =
        category === "Другое" ? customCategory.trim() : category;

      // Получаем данные пользователя Telegram
      const { user } = getTelegramUser();
      const createdBy = user?.username || user?.first_name || undefined;

      const eventData = {
        name: eventName.trim(),
        category: finalCategory, // Категория события
        date: eventDateTime, // Дата + время вместе
        time: time || "00:00", // Время отдельно как строка
        url: url.trim() || undefined,
        description: description.trim() || undefined,
        isFavorite: false,
        location: location.trim() || "string",
        locationCoordinates: locationCoordinates || undefined, // Координаты [lat, lng]
        imagesArray: imagesArray.length > 0 ? imagesArray : undefined,
        createdBy, // Добавляем username пользователя Telegram
      };

      const result = await createEvent(eventData);

      if (result.success) {
        alert("Успешно добавлено!");
        navigate("/add");
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
    if (files && files.length > 0) {
      const file = files[0];
      // Проверяем, что это изображение
      if (file.type.startsWith("image/")) {
        // Заменяем предыдущее фото новым (всегда только одно фото)
        setSelectedFiles([file]);
      }
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(
      selectedFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <Container
      paddingTop={
        platformName === "desktop" ? paddingTop + 92 : paddingTop + 64
      }
    >
      {/* Header */}
      <Header title="Размещение: Событие" showGoBackBtn />

      {/* Progress Bar */}
      <div
        style={{
          padding: "16px 16px 8px",
          backgroundColor: c.background,
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
              color: c.text,
              margin: 0,
            }}
          >
            {steps[currentStepIndex].title}
          </p>
          <p
            style={{
              fontSize: 14,
              color: c.lightText,
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
          padding: "16px 16px 250px",
          // height: "calc(100vh - 290px)",
          overflowY: "auto",
          backgroundColor: c.background,
        }}
      >
        {currentStep === "basic" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <CustomTextField
              maxSymbols={50}
              label="Заголовок *"
              placeholder="Введите заголовок"
              value={eventName}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
              variant="outlined"
            />

            <EventCategoryPicker
              value={category}
              onChange={setCategory}
              customValue={customCategory}
              onCustomValueChange={setCustomCategory}
            />

            <DatePicker
              label="Дата события *"
              value={date}
              onChange={setDate}
              placeholder="Выберите дату события"
              minDate={new Date()}
            />

            <TimePicker
              label="Время события *"
              value={time}
              onChange={setTime}
              placeholder="00:00"
            />
          </div>
        )}

        {currentStep === "location" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ width: "80%", alignSelf: "center" }}>
              <YandexMap
                apiKey={import.meta.env.VITE_YANDEX_MAPS_API_KEY}
                height={300}
                onLocationSelect={(address, coordinates) => {
                  setLocation(address);
                  setLocationCoordinates(coordinates);
                }}
              />
            </div>
            <TextField
              ref={locationInputRef}
              label="Локация/адрес *"
              placeholder="Введите локацию/адрес"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => {
                setTimeout(() => {
                  locationInputRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }, 400);
              }}
              fullWidth
              variant="outlined"
            />
          </div>
        )}

        {currentStep === "photos" && (
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
                startIcon={
                  <VuesaxIcon name="camera" color={c.lighter} size={20} />
                }
              >
                Выбрать
                <input
                  type="file"
                  accept="image/*"
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
                    src={URL.createObjectURL(selectedFiles[0])}
                    alt="Selected"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    onClick={() => removeFile(0)}
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
        )}

        {currentStep === "details" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CustomTextField
              maxSymbols={1000}
              label="Описание"
              placeholder="Опишите подробно"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={6}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Ссылка на источник"
              placeholder="Вставьте ссылку"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              rows={6}
              fullWidth
              variant="outlined"
            />
          </div>
        )}

        {currentStep === "review" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <EventCard
                image={
                  selectedFiles.length > 0
                    ? URL.createObjectURL(selectedFiles[0])
                    : "https://picsum.photos/600?preview"
                }
                date={
                  date
                    ? `${date.getDate()} ${date
                        .toLocaleDateString("ru-RU", {
                          month: "short",
                        })
                        .toUpperCase()
                        .replace(".", "")}`
                    : ""
                }
                time={time}
                title={eventName}
                location={location}
                url={url}
                id="preview"
              />
            </div>

            {description && (
              <div
                style={{
                  padding: 16,
                  backgroundColor: c.surfaceColor,
                  borderRadius: 12,
                  marginTop: 8,
                }}
              >
                <h4
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: c.text,
                    margin: "0 0 8px",
                  }}
                >
                  Описание
                </h4>
                <p
                  style={{
                    fontSize: 14,
                    color: c.text,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 16px 32px",
          backgroundColor: c.background,
          borderTop: `1px solid ${c.surfaceColor}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
          zIndex: 99,
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
          disabled={isPublishing}
        >
          {currentStepIndex === steps.length - 1
            ? isPublishing
              ? "Публикуем..."
              : "Опубликовать"
            : "Далее"}
        </Button>
      </div>
    </Container>
  );
};

export default CreateEvent;
