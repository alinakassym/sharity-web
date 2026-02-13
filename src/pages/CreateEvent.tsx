// sharity-web/src/pages/CreateEvent.tsx

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
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { uploadFiles, PRODUCTS_BUCKET } from "@/lib/minio";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import { useCategories } from "@/hooks/useCategories";
import { useEventTypes } from "@/hooks/useEventTypes";
import { StepEventBasic } from "@/components/StepEventBasic";
import { StepEventLocation } from "@/components/StepEventLocation";
import { StepEventPhoto } from "@/components/StepEventPhoto";
import { StepEventDetails } from "@/components/StepEventDetails";
import { StepEventReview } from "@/components/StepEventReview";
import Container from "@/components/Container";
import Header from "@/components/Header";

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
  const [category, setCategory] = useState("");
  const [eventType, setEventType] = useState("");
  const [customEventType, setCustomEventType] = useState("");
  const locationInputRef = useRef<HTMLDivElement>(null);

  const { createEvent } = useCreateEvent();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const categoryOptions = categories
    .filter((cat) => cat.is_active)
    .map((cat) => ({ value: cat.name_ru, label: cat.name_ru }));
  const { eventTypes, isLoading: eventTypesLoading } = useEventTypes();
  const eventTypeOptions = eventTypes
    .filter((et) => et.is_active)
    .map((et) => ({ value: et.name_ru, label: et.name_ru }));

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

      // Определяем итоговый тип события
      const finalEventType =
        eventType === "Другое" ? customEventType.trim() : eventType;

      // Получаем данные пользователя Telegram
      const { user } = getTelegramUser();
      const createdBy = user?.username || user?.first_name || undefined;

      const eventData = {
        name: eventName.trim(),
        category, // Категория из MongoDB
        eventType: finalEventType, // Тип события
        date: eventDateTime.toISOString(), // Дата + время как ISO-строка
        time: time || "00:00", // Время отдельно как строка
        url: url.trim() || undefined,
        description: description.trim() || undefined,
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
          <StepEventBasic
            eventName={eventName}
            onEventNameChange={setCourseName}
            eventType={eventType}
            onEventTypeChange={setEventType}
            customEventType={customEventType}
            onCustomEventTypeChange={setCustomEventType}
            eventTypeOptions={eventTypeOptions}
            eventTypesLoading={eventTypesLoading}
            category={category}
            onCategoryChange={setCategory}
            categoryOptions={categoryOptions}
            categoriesLoading={categoriesLoading}
            date={date}
            onDateChange={setDate}
            time={time}
            onTimeChange={setTime}
          />
        )}

        {currentStep === "location" && (
          <StepEventLocation
            location={location}
            onLocationChange={setLocation}
            onLocationSelect={(address, coordinates) => {
              setLocation(address);
              setLocationCoordinates(coordinates);
            }}
            locationInputRef={locationInputRef}
          />
        )}

        {currentStep === "photos" && (
          <StepEventPhoto
            selectedFile={selectedFiles[0] ?? null}
            onFileChange={handleFileChange}
            onRemoveFile={() => setSelectedFiles([])}
          />
        )}

        {currentStep === "details" && (
          <StepEventDetails
            description={description}
            onDescriptionChange={setDescription}
            url={url}
            onUrlChange={setUrl}
          />
        )}

        {currentStep === "review" && (
          <StepEventReview
            eventName={eventName}
            date={date}
            time={time}
            location={location}
            url={url}
            description={description}
            selectedFile={selectedFiles[0] ?? null}
          />
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
