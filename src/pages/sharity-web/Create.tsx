// sharity-web/src/pages/sharity-web/Create.tsx

import type { FC } from "react";
import { useState, useEffect, useMemo, useRef, useReducer } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import { Colors } from "@/theme/colors";
import { StepBasic } from "@/components/StepBasic";
import { StepPhotos } from "@/components/StepPhotos";
import { StepReview } from "@/components/StepReview";
import { StepDetails } from "@/components/StepDetails";

import { useRequestGetCategories } from "@/hooks/useRequestGetCategories";
import { useRequestGetGymnasticsCategories } from "@/hooks/useRequestGetGymnasticsCategories";
import { useRequestGetLeotardSizes } from "@/hooks/useRequestGetLeotardSizes";
import { PRODUCTS_BUCKET, testConnection, uploadFiles } from "@/lib/minio";
import Header from "@/components/Header";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import Container from "@/components/Container";
import { getTelegramUser } from "@/lib/telegram";
import { useRequestCreateProduct } from "@/hooks/useRequestCreateProduct";
import { useNavigate } from "react-router-dom";

type StepType = "basic" | "photos" | "details" | "review";

type CreateFormState = {
  category: string;
  subcategory: string;
  productSize: string;
  condition: string;
  selectedFiles: File[];
  productName: string;
  price: string;
  description: string;
};

type CreateFormAction =
  | {
      type: "SET_FIELD";
      field: keyof Omit<CreateFormState, "selectedFiles">;
      value: string;
    }
  | { type: "ADD_FILES"; files: File[] }
  | { type: "REMOVE_FILE"; index: number }
  | { type: "RESET_SUBCATEGORY_AND_SIZE" }
  | { type: "RESET_SIZE" };

const initialFormState: CreateFormState = {
  category: "",
  subcategory: "",
  productSize: "",
  condition: "",
  selectedFiles: [],
  productName: "",
  price: "",
  description: "",
};

const formReducer = (
  state: CreateFormState,
  action: CreateFormAction,
): CreateFormState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

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

    case "RESET_SUBCATEGORY_AND_SIZE":
      return { ...state, subcategory: "", productSize: "" };

    case "RESET_SIZE":
      return { ...state, productSize: "" };

    default:
      return state;
  }
};

const Create: FC = () => {
  const [currentStep, setCurrentStep] = useState<StepType>("basic");
  const [isPublishing, setIsPublishing] = useState(false);
  const [basicErrors, setBasicErrors] = useState<{
    productName?: string;
    category?: string;
    subcategory?: string;
    productSize?: string;
    price?: string;
  }>({});
  const [filePreviews, setFilePreviews] = useState<
    Array<{ file: File; url: string }>
  >([]);

  const clearBasicError = (field: keyof typeof basicErrors) => {
    setBasicErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const [form, dispatch] = useReducer(formReducer, initialFormState);

  const scheme = useColorScheme();
  const c = Colors[scheme];
  const paddingTop = useSafePaddingTop(48, 44);
  const platformName = useSafePlatform();
  const { createProduct } = useRequestCreateProduct();
  const navigate = useNavigate();

  // Refs для автофокуса
  const subcategoryInputRef = useRef<HTMLInputElement>(null);
  const sizeInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const { categories: categoriesFromFirebase, isLoading: isLoadingCategories } =
    useRequestGetCategories();
  const {
    categories: gymnasticsCategories,
    isLoading: isLoadingGymnasticsCategories,
  } = useRequestGetGymnasticsCategories();
  const { sizes: leotardSizes, isLoading: isLoadingLeotardSizes } =
    useRequestGetLeotardSizes();

  // Преобразуем категории из Firebase для использования в Select
  const categoryOptions = useMemo(() => {
    return categoriesFromFirebase;
  }, [categoriesFromFirebase]);

  // Преобразуем подкатегории гимнастики для использования в Select
  const gymnasticsSubcategoryOptions = useMemo(() => {
    return gymnasticsCategories;
  }, [gymnasticsCategories]);

  // Преобразуем размеры купальников для использования в Select
  const leotardSizeOptions = useMemo(() => {
    return leotardSizes.map((size) => ({
      value: `${size.size}`,
      label: `${size.size} (${size.height})`,
    }));
  }, [leotardSizes]);

  // Очищаем подкатегорию гимнастики при изменении основной категории
  useEffect(() => {
    if (form.category !== "Гимнастика") {
      dispatch({ type: "RESET_SUBCATEGORY_AND_SIZE" });
    }
  }, [form.category]);

  // Очищаем размер купальника при изменении подкатегории
  useEffect(() => {
    if (form.subcategory !== "Купальник") {
      dispatch({ type: "RESET_SIZE" });
    }
  }, [form.subcategory]);

  // Обработчик изменения категории
  const handleCategoryChange = (newCategory: string) => {
    clearBasicError("category");
    dispatch({ type: "SET_FIELD", field: "category", value: newCategory });

    if (newCategory !== "Гимнастика") {
      dispatch({ type: "RESET_SUBCATEGORY_AND_SIZE" });
    }

    setTimeout(() => {
      if (newCategory === "Гимнастика") {
        subcategoryInputRef.current?.focus();
      } else {
        priceInputRef.current?.focus();
      }
    }, 300);
  };

  // Обработчик изменения подкатегории
  const handleSubcategoryChange = (newSubcategory: string) => {
    clearBasicError("subcategory");
    dispatch({
      type: "SET_FIELD",
      field: "subcategory",
      value: newSubcategory,
    });

    if (newSubcategory !== "Купальник") {
      dispatch({ type: "RESET_SIZE" });
    }

    setTimeout(() => {
      if (newSubcategory === "Купальник") {
        sizeInputRef.current?.focus();
      } else {
        priceInputRef.current?.focus();
      }
    }, 300);
  };

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
    if (currentStep === "basic") {
      const nextErrors: typeof basicErrors = {};

      if (!form.productName.trim()) {
        nextErrors.productName = "Введите название товара";
      }

      if (!form.category.trim()) {
        nextErrors.category = "Выберите категорию";
      }

      if (form.category === "Гимнастика" && !form.subcategory.trim()) {
        nextErrors.subcategory = "Выберите подкатегорию";
      }

      if (
        form.category === "Гимнастика" &&
        form.subcategory === "Купальник" &&
        !form.productSize.trim()
      ) {
        nextErrors.productSize = "Выберите размер";
      }

      if (!form.price.trim() || Number(form.price) <= 0) {
        nextErrors.price = "Укажите цену больше 0";
      }

      setBasicErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        return;
      }
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    } else {
      handlePublish();
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      let imagesArray: string[] = [];

      if (form.selectedFiles.length > 0) {
        imagesArray = await uploadFiles(PRODUCTS_BUCKET, form.selectedFiles);
      }

      const { user } = getTelegramUser();
      const createdBy = user?.username || user?.first_name || undefined;

      const productData = {
        name: form.productName.trim(),
        category: form.category,
        subcategory: form.subcategory || undefined,
        productSize: form.productSize ? Number(form.productSize) : undefined,
        price: Number(form.price),
        description: form.description.trim() || undefined,
        condition: form.condition || undefined,
        isFavorite: false,
        imagesArray: imagesArray.length > 0 ? imagesArray : undefined,
        createdBy,
      };

      const result = await createProduct(productData);

      if (result.success) {
        alert("Товар успешно добавлен!");
        navigate("/store");
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      console.error("Ошибка при создании товара:", error);
      alert(`Ошибка при загрузке изображений: ${error}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filesArray = Array.from(files);

    // Фильтруем только изображения
    const imageFiles = filesArray.filter((file) =>
      file.type.startsWith("image/"),
    );

    dispatch({ type: "ADD_FILES", files: imageFiles });
  };

  const removeFile = (indexToRemove: number) => {
    dispatch({ type: "REMOVE_FILE", index: indexToRemove });
  };

  return (
    <Container
      paddingTop={
        platformName === "desktop" ? paddingTop + 92 : paddingTop + 44
      }
    >
      {/* Header */}
      <Header title="Размещение: Продажа" showGoBackBtn />

      {/* Progress Bar */}
      <div
        style={{
          padding: "16px 16px 8px",
          backgroundColor: c.background,
        }}
      >
        <Stepper
          activeStep={currentStepIndex}
          alternativeLabel
          aria-label="Шаги создания объявления"
        >
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    position: "absolute",
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: "hidden",
                    clip: "rect(0, 0, 0, 0)",
                    whiteSpace: "nowrap",
                    border: 0,
                  },
                }}
              >
                {step.title}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: c.lightText,
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
          <StepBasic
            form={form}
            dispatch={dispatch}
            basicErrors={basicErrors}
            clearBasicError={clearBasicError}
            categoryOptions={categoryOptions.map((cat) => ({
              value: cat.name_ru,
              label: cat.name_ru,
            }))}
            gymnasticsSubcategoryOptions={gymnasticsSubcategoryOptions.map(
              (cat) => ({
                value: cat.name_ru,
                label: cat.name_ru,
              }),
            )}
            leotardSizeOptions={leotardSizeOptions}
            isLoadingCategories={isLoadingCategories}
            isLoadingGymnasticsCategories={isLoadingGymnasticsCategories}
            isLoadingLeotardSizes={isLoadingLeotardSizes}
            handleCategoryChange={handleCategoryChange}
            handleSubcategoryChange={handleSubcategoryChange}
            subcategoryInputRef={subcategoryInputRef}
            sizeInputRef={sizeInputRef}
            priceInputRef={priceInputRef}
          />
        )}

        {currentStep === "photos" && (
          <StepPhotos
            c={c}
            selectedFiles={form.selectedFiles}
            filePreviews={filePreviews}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
          />
        )}

        {currentStep === "details" && (
          <StepDetails form={form} dispatch={dispatch} />
        )}

        {currentStep === "review" && (
          <StepReview c={c} form={form} filePreviews={filePreviews} />
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

export default Create;
