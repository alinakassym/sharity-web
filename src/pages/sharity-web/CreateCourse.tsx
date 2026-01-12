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
import YandexMap from "@/components/YandexMap";
import { StepCourseBasic } from "@/components/StepCourseBasic";
import { StepCoursePhotos } from "@/components/StepCoursePhotos";
import { StepCourseReview } from "@/components/StepCourseReview";
import { StepCourseDetails } from "@/components/StepCourseDetails";
import { StepCourseLocation } from "@/components/StepCourseLocation";

import { uploadFiles, PRODUCTS_BUCKET } from "@/lib/minio";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Container from "@/components/Container";
import Header from "@/components/Header";

type StepType = "basic" | "location" | "photos" | "details" | "review";

type CreateCourseFormState = {
  category: string;
  selectedFiles: File[];
  courseName: string;
  description: string;
  shortDescription: string;

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
  shortDescription: "",

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
  const [basicErrors, setBasicErrors] = useState<{
    courseName?: string;
    category?: string;
  }>({});
  const [locationErrors, setLocationErrors] = useState<{
    locations?: string;
    contacts?: string;
  }>({});
  const [photosErrors, setPhotosErrors] = useState<{
    photos?: string;
  }>({});
  const [detailsErrors, setDetailsErrors] = useState<{
    description?: string;
  }>({});

  const [ageFrom, setAgeFrom] = useState<number | undefined>();
  const [ageTo, setAgeTo] = useState<number | undefined>();
  const [priceFrom, setPriceFrom] = useState<number | undefined>();

  // Состояние для переключателя короткого описания
  const [showShortDescription, setShowShortDescription] = useState(false);

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

  const clearBasicError = (field: keyof typeof basicErrors) => {
    setBasicErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const clearLocationError = (field: keyof typeof locationErrors) => {
    setLocationErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const clearPhotosError = (field: keyof typeof photosErrors) => {
    setPhotosErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const clearDetailsError = (field: keyof typeof detailsErrors) => {
    setDetailsErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

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
    // Валидация для первого шага (basic)
    if (currentStep === "basic") {
      const nextErrors: typeof basicErrors = {};

      if (!form.courseName.trim()) {
        nextErrors.courseName = "Введите название курса";
      }

      if (!form.category.trim()) {
        nextErrors.category = "Выберите категорию";
      }

      setBasicErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        return;
      }
    }

    // Валидация для второго шага (location)
    if (currentStep === "location") {
      const nextErrors: typeof locationErrors = {};

      if (form.locations.length === 0) {
        nextErrors.locations = "Добавьте хотя бы одну локацию";
      }

      const hasContact = form.phone.trim() || form.whatsapp.trim() || form.telegram.trim();
      if (!hasContact) {
        nextErrors.contacts = "Укажите хотя бы один способ связи";
      }

      setLocationErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        return;
      }
    }

    // Валидация для третьего шага (photos)
    if (currentStep === "photos") {
      const nextErrors: typeof photosErrors = {};

      if (form.selectedFiles.length === 0) {
        nextErrors.photos = "Добавьте хотя бы одну фотографию";
      }

      setPhotosErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        return;
      }
    }

    // Валидация для четвертого шага (details)
    if (currentStep === "details") {
      const nextErrors: typeof detailsErrors = {};

      if (!form.description.trim()) {
        nextErrors.description = "Введите описание курса";
      }

      setDetailsErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        return;
      }
    }

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
        shortDescription:
          showShortDescription && form.shortDescription.trim()
            ? form.shortDescription.trim()
            : undefined,
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
          <StepCourseBasic
            form={form}
            dispatch={dispatch}
            basicErrors={basicErrors}
            clearBasicError={clearBasicError}
          />
        )}

        {currentStep === "location" && (
          <StepCourseLocation
            locations={form.locations}
            phone={form.phone}
            whatsapp={form.whatsapp}
            telegram={form.telegram}
            onOpenLocationModal={handleOpenLocationModal}
            onRemoveLocation={handleRemoveLocation}
            onChangePhone={(value) =>
              dispatch({ type: "SET_FIELD", field: "phone", value })
            }
            onChangeWhatsapp={(value) =>
              dispatch({ type: "SET_FIELD", field: "whatsapp", value })
            }
            onChangeTelegram={(value) =>
              dispatch({ type: "SET_FIELD", field: "telegram", value })
            }
            locationErrors={locationErrors}
            clearLocationError={clearLocationError}
          />
        )}

        {currentStep === "photos" && (
          <StepCoursePhotos
            selectedFiles={form.selectedFiles}
            filePreviews={filePreviews}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
            photosErrors={photosErrors}
            clearPhotosError={clearPhotosError}
          />
        )}

        {currentStep === "details" && (
          <StepCourseDetails
            form={form}
            dispatch={dispatch}
            ageFrom={ageFrom}
            setAgeFrom={setAgeFrom}
            ageTo={ageTo}
            setAgeTo={setAgeTo}
            priceFrom={priceFrom}
            setPriceFrom={setPriceFrom}
            detailsErrors={detailsErrors}
            clearDetailsError={clearDetailsError}
          />
        )}

        {currentStep === "review" && (
          <StepCourseReview
            c={c}
            form={form}
            filePreviews={filePreviews}
            showShortDescription={showShortDescription}
            setShowShortDescription={setShowShortDescription}
            dispatch={dispatch}
            ageFrom={ageFrom}
            ageTo={ageTo}
            priceFrom={priceFrom}
            setAgeFrom={setAgeFrom}
            setAgeTo={setAgeTo}
            setPriceFrom={setPriceFrom}
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
