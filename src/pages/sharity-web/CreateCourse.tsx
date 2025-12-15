import type { FC } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRequestCreateCourse } from "@/hooks/useRequestCreateCourse";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import { getTelegramUser } from "@/lib/telegram";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import CourseCard from "@/components/CourseCard";
import YandexMap from "@/components/YandexMap";
import { testConnection, uploadFiles, PRODUCTS_BUCKET } from "@/lib/minio";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Container from "@/components/Container";
import Header from "@/components/Header";
import CustomSelect from "@/components/CustomSelect";

type StepType = "basic" | "location" | "photos" | "details" | "review";

const CreateCourse: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];

  const paddingTop = useSafePaddingTop(48, 44);
  const platformName = useSafePlatform();

  const [isPublishing, setIsPublishing] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepType>("basic");
  const [category, setCategory] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  // Новая структура данных для локаций
  const [locations, setLocations] = useState<
    Array<{ location: string; locationCoordinates: [number, number] }>
  >([]);

  // Состояние для модального окна
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState("");
  const [tempLocationCoordinates, setTempLocationCoordinates] = useState<
    [number, number] | undefined
  >();

  const { createCourse } = useRequestCreateCourse();

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
      description: "Название, категория",
    },
    {
      id: "location",
      title: "Локация",
      description: "Адрес",
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
    } else {
      // Публикация
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

      // Получаем данные пользователя Telegram
      const { user } = getTelegramUser();
      const createdBy = user?.username || user?.first_name || undefined;

      const courseData = {
        name: courseName.trim(),
        category,
        description: description.trim() || undefined,
        isFavorite: false,
        imagesArray: imagesArray.length > 0 ? imagesArray : undefined,
        createdBy, // Добавляем username пользователя Telegram
        locations: locations.length > 0 ? locations : undefined, // Массив локаций
      };

      const result = await createCourse(courseData);

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

  // Обработчики для модального окна локации
  const handleOpenLocationModal = () => {
    setTempLocation("");
    setTempLocationCoordinates(undefined);
    setIsLocationModalOpen(true);
  };

  const handleCloseLocationModal = () => {
    setIsLocationModalOpen(false);
    setTempLocation("");
    setTempLocationCoordinates(undefined);
  };

  const handleAddLocation = () => {
    if (tempLocation.trim() && tempLocationCoordinates) {
      setLocations([
        ...locations,
        {
          location: tempLocation.trim(),
          locationCoordinates: tempLocationCoordinates,
        },
      ]);
      handleCloseLocationModal();
    }
  };

  const handleRemoveLocation = (indexToRemove: number) => {
    setLocations(locations.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Container
      paddingTop={
        platformName === "desktop" ? paddingTop + 92 : paddingTop + 44
      }
    >
      {/* Header */}
      <Header title="Размещение: Классы/Школы" showGoBackBtn />

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
          padding: "16px 16px 100px",
          height: "calc(100vh - 290px)",
          overflowY: "auto",
          backgroundColor: c.background,
        }}
      >
        {currentStep === "basic" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label="Название *"
              placeholder="Введите название"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
              variant="outlined"
            />

            <CustomSelect
              label="Категория"
              value={category}
              onChange={setCategory}
              options={[
                { value: "Гимнастика", label: "Гимнастика" },
                { value: "Танцы", label: "Танцы" },
                { value: "Балет", label: "Балет" },
                { value: "Волейбол", label: "Волейбол" },
                { value: "Теннис", label: "Теннис" },
                { value: "Футбол", label: "Футбол" },
                { value: "Хоккей", label: "Хоккей" },
                { value: "Бег", label: "Бег" },
              ]}
              placeholder="Выберите категорию"
              required
              searchable
            />
          </div>
        )}

        {currentStep === "location" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Список добавленных адресов */}
            {locations.length > 0 && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {locations.map((loc, index) => (
                  <div
                    key={index}
                    style={{
                      padding: 16,
                      backgroundColor: c.surfaceColor,
                      borderRadius: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 600,
                          color: c.text,
                        }}
                      >
                        {loc.location}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: 12,
                          color: c.lightText,
                        }}
                      >
                        {loc.locationCoordinates[0].toFixed(6)},{" "}
                        {loc.locationCoordinates[1].toFixed(6)}
                      </p>
                    </div>
                    <IconButton
                      onClick={() => handleRemoveLocation(index)}
                      size="small"
                      sx={{
                        borderColor: c.error,
                        borderWidth: 1,
                        borderStyle: "solid",
                        backgroundColor: `${c.error}20`,
                      }}
                    >
                      <VuesaxIcon name="close" size={16} color={c.error} />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}

            {/* Кнопка добавить адрес */}
            <Button
              variant="outlined"
              fullWidth
              onClick={handleOpenLocationModal}
              startIcon={
                <VuesaxIcon name="location" size={20} color={c.primary} />
              }
            >
              Добавить адрес
            </Button>
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
                Добавьте фотографии
              </p>
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: 14,
                  color: c.lightText,
                }}
              >
                Выберите фотографии
              </p>
              <Button
                component="label"
                variant="contained"
                startIcon={
                  <VuesaxIcon name="camera" color={c.lighter} size={20} />
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
                    color: c.text,
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
                        backgroundColor: c.controlColor,
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
                  color: c.text,
                  margin: "0 0 8px",
                }}
              >
                Предпросмотр объявления
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: c.lightText,
                  margin: 0,
                }}
              >
                Проверьте, как будет выглядеть ваше объявление
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <CourseCard
                showHeartBtn={false}
                course={{
                  id: "preview",
                  image:
                    selectedFiles.length > 0
                      ? URL.createObjectURL(selectedFiles[0])
                      : "https://picsum.photos/600?preview",
                  category: category || "Без категории",
                  title: courseName || "Название",
                }}
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

            {selectedFiles.length > 1 && (
              <div
                style={{
                  padding: 16,
                  backgroundColor: c.surfaceColor,
                  borderRadius: 12,
                }}
              >
                <h4
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: c.text,
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

      {/* Модальное окно для добавления локации */}
      <Dialog
        open={isLocationModalOpen}
        onClose={handleCloseLocationModal}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiPaper-root": { background: c.surfaceColor } }}
      >
        <DialogTitle>Добавить адрес</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              paddingTop: 8,
            }}
          >
            <YandexMap
              apiKey={import.meta.env.VITE_YANDEX_MAPS_API_KEY}
              height={300}
              onLocationSelect={(address, coordinates) => {
                setTempLocation(address);
                setTempLocationCoordinates(coordinates);
              }}
            />
            <div style={{ width: "100%" }}>
              <TextField
                label="Адрес"
                placeholder="Выберите адрес на карте"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                fullWidth
                aria-readonly
                sx={{
                  "& .MuiFormLabel-root": {
                    backgroundColor: c.surfaceColor,
                  },
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "24px",
            borderTopWidth: 1,
            borderTopColor: c.background,
            borderTopStyle: "solid",
          }}
        >
          <Button onClick={handleCloseLocationModal}>Отмена</Button>
          <Button
            onClick={handleAddLocation}
            variant="contained"
            disabled={!tempLocation.trim() || !tempLocationCoordinates}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateCourse;
