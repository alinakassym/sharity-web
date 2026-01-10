// sharity-web/src/pages/sharity-web/CreateCourse.tsx

import type { FC } from "react";
import { useState, useEffect, useReducer } from "react";
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
import { StepCoursePhotos } from "@/components/StepCoursePhotos";

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

type CreateCourseFormState = {
  category: string;
  selectedFiles: File[];
  courseName: string;
  description: string;

  locations: Array<{ location: string; locationCoordinates: [number, number] }>;

  coverImageIndex: number;
  ageFrom?: number;
  ageTo?: number;
  priceFrom?: number;
  priceText: string;
  scheduleText: string;

  phone: string;
  whatsapp: string;
  telegram: string;
};

type CreateCourseFormAction =
  | {
      type: "SET_FIELD";
      field: keyof Omit<CreateCourseFormState, "selectedFiles" | "locations">;
      value: CreateCourseFormState[keyof Omit<
        CreateCourseFormState,
        "selectedFiles" | "locations"
      >];
    }
  | { type: "ADD_FILES"; files: File[] }
  | { type: "REMOVE_FILE"; index: number }
  | {
      type: "SET_LOCATIONS";
      locations: Array<{
        location: string;
        locationCoordinates: [number, number];
      }>;
    }
  | { type: "RESET_LOCATIONS" };

const initialCourseFormState: CreateCourseFormState = {
  category: "",
  selectedFiles: [],
  courseName: "",
  description: "",

  locations: [],

  coverImageIndex: 0,
  ageFrom: undefined,
  ageTo: undefined,
  priceFrom: undefined,
  priceText: "",
  scheduleText: "",

  phone: "",
  whatsapp: "",
  telegram: "",
};

const courseFormReducer = (
  state: CreateCourseFormState,
  action: CreateCourseFormAction,
): CreateCourseFormState => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      } as CreateCourseFormState;

    case "ADD_FILES":
      return {
        ...state,
        selectedFiles: [...state.selectedFiles, ...action.files],
      };

    case "REMOVE_FILE":
      return {
        ...state,
        selectedFiles: state.selectedFiles.filter((_, i) => i !== action.index),
      };

    case "SET_LOCATIONS":
      return { ...state, locations: action.locations };

    case "RESET_LOCATIONS":
      return { ...state, locations: [] };

    default:
      return state;
  }
};

const CreateCourse: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];

  const paddingTop = useSafePaddingTop(48, 44);
  const platformName = useSafePlatform();

  const [isPublishing, setIsPublishing] = useState(false);
  const [filePreviews, setFilePreviews] = useState<
    Array<{ file: File; url: string }>
  >([]);

  const [currentStep, setCurrentStep] = useState<StepType>("basic");

  const [ageFrom, setAgeFrom] = useState<number | undefined>();
  const [ageTo, setAgeTo] = useState<number | undefined>();
  const [priceFrom, setPriceFrom] = useState<number | undefined>();

  // Состояние для модального окна
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState("");
  const [tempLocationCoordinates, setTempLocationCoordinates] = useState<
    [number, number] | undefined
  >();

  const [form, dispatch] = useReducer(
    courseFormReducer,
    initialCourseFormState,
  );

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

  useEffect(() => {
    if (form.selectedFiles.length === 0) {
      setFilePreviews([]);
      return;
    }

    const previews = form.selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFilePreviews(previews);

    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [form.selectedFiles]);

  const steps: Array<{ id: StepType; title: string; description: string }> = [
    {
      id: "basic",
      title: "Основная информация",
      description: "Название, категория",
    },
    {
      id: "location",
      title: "Локация и контакты",
      description: "Адреса и способы связи",
    },
    { id: "photos", title: "Фотографии", description: "Добавьте фото товара" },
    {
      id: "details",
      title: "Описание и детали",
      description: "Описание, возраст, цена, расписание",
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
      let coverImage: string | undefined;

      // Загружаем изображения в S3, если они выбраны
      if (form.selectedFiles.length > 0) {
        console.log(
          `Загружаем ${form.selectedFiles.length} изображений в Object Storage...`,
        );
        imagesArray = await uploadFiles(PRODUCTS_BUCKET, form.selectedFiles);
        console.log("Все изображения загружены:", imagesArray);

        // ➕ Сохраняем главное изображение
        coverImage = imagesArray[form.coverImageIndex];
      }

      // Получаем данные пользователя Telegram
      const { user } = getTelegramUser();
      const createdBy = user?.username || user?.first_name || undefined;

      const courseData = {
        name: form.courseName.trim(),
        category: form.category,
        description: form.description.trim() || undefined,
        isFavorite: false,
        imagesArray: imagesArray.length > 0 ? imagesArray : undefined,
        createdBy, // Добавляем username пользователя Telegram
        locations: form.locations.length > 0 ? form.locations : undefined, // Массив локаций

        // ➕ НОВЫЕ поля
        coverImage,
        ageFrom: ageFrom ?? undefined,
        ageTo: ageTo ?? undefined,
        priceFrom: priceFrom ?? undefined,
        priceText: form.priceText.trim() || undefined,
        scheduleText: form.scheduleText.trim() || undefined,
        phone: form.phone.trim() || undefined,
        whatsapp: form.whatsapp.trim() || undefined,
        telegram: form.telegram.trim() || undefined,
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
    if (!files) return;

    const filesArray = Array.from(files);

    // если нужно только изображения — оставь фильтр, иначе убери
    const imageFiles = filesArray.filter((file) =>
      file.type.startsWith("image/"),
    );

    dispatch({ type: "ADD_FILES", files: imageFiles });
  };

  const removeFile = (indexToRemove: number) => {
    dispatch({ type: "REMOVE_FILE", index: indexToRemove });
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
      dispatch({
        type: "SET_LOCATIONS",
        locations: [
          ...form.locations,
          {
            location: tempLocation.trim(),
            locationCoordinates: tempLocationCoordinates,
          },
        ],
      });
      handleCloseLocationModal();
    }
  };

  const handleRemoveLocation = (indexToRemove: number) => {
    dispatch({
      type: "SET_LOCATIONS",
      locations: form.locations.filter((_, index) => index !== indexToRemove),
    });
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
              value={form.courseName}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "courseName",
                  value: e.target.value,
                })
              }
              fullWidth
              variant="outlined"
            />

            <CustomSelect
              label="Категория"
              value={form.category}
              onChange={(value) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "category",
                  value,
                })
              }
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
            {form.locations.length > 0 && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {form.locations.map((loc, index) => (
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

            {/* ➕ НОВЫЙ БЛОК: Контакты */}
            <div
              style={{
                marginTop: 24,
                paddingTop: 24,
                borderTop: `1px solid ${c.surfaceColor}`,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: c.text,
                  margin: "0 0 16px",
                }}
              >
                Контакты
              </h3>

              <TextField
                label="Телефон"
                placeholder="+7 (___) ___-__-__"
                value={form.phone}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "phone",
                    value: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
                style={{ marginBottom: 16 }}
              />

              <TextField
                label="WhatsApp"
                placeholder="+7 (___) ___-__-__"
                value={form.whatsapp}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "whatsapp",
                    value: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
                style={{ marginBottom: 16 }}
              />

              <TextField
                label="Telegram"
                placeholder="@username"
                value={form.telegram}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "telegram",
                    value: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
              />
            </div>
          </div>
        )}

        {currentStep === "photos" && (
          <StepCoursePhotos
            c={c}
            selectedFiles={form.selectedFiles}
            filePreviews={filePreviews}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
          />
        )}

        {currentStep === "details" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label="Описание"
              placeholder="Опишите подробно"
              value={form.description}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "description",
                  value: e.target.value,
                })
              }
              multiline
              rows={6}
              fullWidth
              variant="outlined"
            />

            {/* ➕ НОВЫЕ поля: Возрастная группа */}
            <div
              style={{
                paddingTop: 24,
                marginTop: 8,
                borderTop: `1px solid ${c.surfaceColor}`,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: c.text,
                  margin: "0 0 16px",
                }}
              >
                Возрастная группа
              </h3>
              <div style={{ display: "flex", gap: 16 }}>
                <TextField
                  label="От (лет)"
                  type="number"
                  placeholder="5"
                  value={ageFrom ?? ""}
                  onChange={(e) =>
                    setAgeFrom(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  variant="outlined"
                  style={{ flex: 1 }}
                />
                <TextField
                  label="До (лет)"
                  type="number"
                  placeholder="12"
                  value={ageTo ?? ""}
                  onChange={(e) =>
                    setAgeTo(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  variant="outlined"
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            {/* ➕ НОВЫЕ поля: Стоимость */}
            <div
              style={{
                paddingTop: 24,
                marginTop: 8,
                borderTop: `1px solid ${c.surfaceColor}`,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: c.text,
                  margin: "0 0 16px",
                }}
              >
                Стоимость
              </h3>
              <TextField
                label="Цена от (₸)"
                type="number"
                placeholder="15000"
                value={priceFrom ?? ""}
                onChange={(e) =>
                  setPriceFrom(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                fullWidth
                variant="outlined"
                style={{ marginBottom: 16 }}
              />
              <TextField
                label="Описание цены (опционально)"
                placeholder="Например: абонемент 25 000₸/мес или цена по запросу"
                value={form.priceText}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "priceText",
                    value: e.target.value,
                  })
                }
                fullWidth
                multiline
                rows={2}
                variant="outlined"
              />
            </div>

            {/* ➕ НОВОЕ поле: Расписание */}
            <div
              style={{
                paddingTop: 24,
                marginTop: 8,
                borderTop: `1px solid ${c.surfaceColor}`,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: c.text,
                  margin: "0 0 16px",
                }}
              >
                Расписание
              </h3>
              <TextField
                label="Расписание"
                placeholder="Например: Пн–Сб 10:00–20:00"
                value={form.scheduleText}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "scheduleText",
                    value: e.target.value,
                  })
                }
                fullWidth
                multiline
                rows={2}
                variant="outlined"
              />
            </div>
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
                    form.selectedFiles.length > 0
                      ? filePreviews[form.coverImageIndex]?.url
                      : "https://picsum.photos/600?preview",
                  category: form.category || "Без категории",
                  title: form.courseName || "Название",
                }}
              />
            </div>

            {/* ➕ НОВОЕ: Показываем возраст */}
            {(ageFrom || ageTo) && (
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
                  Возраст
                </h4>
                <p
                  style={{
                    fontSize: 14,
                    color: c.text,
                    margin: 0,
                  }}
                >
                  {ageFrom && `от ${ageFrom}`} {ageTo && `до ${ageTo} лет`}
                </p>
              </div>
            )}

            {/* ➕ НОВОЕ: Показываем цену */}
            {(priceFrom || form.priceText) && (
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
                  Стоимость
                </h4>
                {priceFrom && (
                  <p style={{ fontSize: 14, color: c.text, margin: "0 0 4px" }}>
                    От {priceFrom}₸
                  </p>
                )}
                {form.priceText && (
                  <p style={{ fontSize: 14, color: c.text, margin: 0 }}>
                    {form.priceText}
                  </p>
                )}
              </div>
            )}

            {/* ➕ НОВОЕ: Показываем расписание */}
            {form.scheduleText && (
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
                  Расписание
                </h4>
                <p
                  style={{
                    fontSize: 14,
                    color: c.text,
                    margin: 0,
                  }}
                >
                  {form.scheduleText}
                </p>
              </div>
            )}

            {/* ➕ НОВОЕ: Показываем контакты */}
            {(form.phone || form.whatsapp || form.telegram) && (
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
                  Контакты
                </h4>
                {form.phone && (
                  <p style={{ fontSize: 14, color: c.text, margin: "0 0 4px" }}>
                    <strong>Телефон:</strong> {form.phone}
                  </p>
                )}
                {form.whatsapp && (
                  <p style={{ fontSize: 14, color: c.text, margin: "0 0 4px" }}>
                    <strong>WhatsApp:</strong> {form.whatsapp}
                  </p>
                )}
                {form.telegram && (
                  <p style={{ fontSize: 14, color: c.text, margin: 0 }}>
                    <strong>Telegram:</strong> {form.telegram}
                  </p>
                )}
              </div>
            )}

            {form.description && (
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
                  {form.description}
                </p>
              </div>
            )}

            {form.selectedFiles.length > 1 && (
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
                  Дополнительные фото ({form.selectedFiles.length - 1})
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
                    gap: 8,
                  }}
                >
                  {filePreviews.slice(1).map((_, index) => (
                    <img
                      key={index}
                      src={filePreviews[index]?.url}
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
