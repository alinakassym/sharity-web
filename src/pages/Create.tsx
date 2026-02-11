// sharity-web/src/pages/Create.tsx

import type { FC } from "react";
import { useState, useEffect, useMemo, useRef, useReducer } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import { Colors } from "@/theme/colors";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { StepBasic } from "@/components/StepBasic";
import { StepPhotos } from "@/components/StepPhotos";
import { StepReview } from "@/components/StepReview";
import { StepDetails } from "@/components/StepDetails";

import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { useSizes, type SizeData } from "@/hooks/useSizes";
import { PRODUCTS_BUCKET, uploadFiles } from "@/lib/minio";

import { Stepper, Step, StepLabel, Button } from "@mui/material";

import { getTelegramUser } from "@/lib/telegram";
import { useRequestCreateProduct } from "@/hooks/useRequestCreateProduct";
import { useNavigate } from "react-router-dom";

import { moveSelectedToStart } from "@/utils";

type StepType = "basic" | "photos" | "details" | "review";

type CreateFormState = {
  categoryId: string;
  subcategoryId: string;
  sizeId: string;
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
  categoryId: "",
  subcategoryId: "",
  sizeId: "",
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
      return { ...state, subcategoryId: "", sizeId: "" };

    case "RESET_SIZE":
      return { ...state, sizeId: "" };

    default:
      return state;
  }
};

const buildSizeLabel = (size: SizeData): string => {
  let label = size.manufacturer_size;
  const details: string[] = [];
  if (size.height_from != null || size.height_to != null) {
    details.push(`рост ${size.height_from ?? "?"}–${size.height_to ?? "?"} см`);
  }
  if (size.diameter != null) details.push(`диаметр ${size.diameter} см`);
  if (size.length != null) details.push(`длина ${size.length} см`);
  if (size.circumference) details.push(`окружность ${size.circumference} мм`);
  if (details.length > 0) label += ` (${details.join(", ")})`;
  return label;
};

const Create: FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState<StepType>("basic");
  const [isPublishing, setIsPublishing] = useState(false);
  const [basicErrors, setBasicErrors] = useState<{
    productName?: string;
    category?: string;
    subcategory?: string;
    size?: string;
    price?: string;
  }>({});
  const [filePreviews, setFilePreviews] = useState<
    Array<{ file: File; url: string }>
  >([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);

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

  // Загрузка данных из MongoDB API
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { subcategories, isLoading: isLoadingSubcategories } =
    useSubcategories(form.categoryId || null);
  const { sizes, isLoading: isLoadingSizes } = useSizes(
    form.categoryId || null,
    form.subcategoryId || null,
  );

  // Фильтруем только активные
  const activeCategories = useMemo(
    () => categories.filter((c) => c.is_active),
    [categories],
  );
  const activeSubcategories = useMemo(
    () => subcategories.filter((s) => s.is_active),
    [subcategories],
  );
  const activeSizes = useMemo(
    () => sizes.filter((s) => s.is_active),
    [sizes],
  );

  // Опции для Select
  const categoryOptions = useMemo(
    () => activeCategories.map((c) => ({ value: c.id, label: c.name_ru })),
    [activeCategories],
  );
  const subcategoryOptions = useMemo(
    () => activeSubcategories.map((s) => ({ value: s.id, label: s.name_ru })),
    [activeSubcategories],
  );
  const sizeOptions = useMemo(
    () =>
      activeSizes.map((s) => ({ value: s.id, label: buildSizeLabel(s) })),
    [activeSizes],
  );

  // Вычисляем выбранные объекты для отображения имён
  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === form.categoryId),
    [categories, form.categoryId],
  );
  const selectedSubcategory = useMemo(
    () => subcategories.find((s) => s.id === form.subcategoryId),
    [subcategories, form.subcategoryId],
  );
  const selectedSize = useMemo(
    () => sizes.find((s) => s.id === form.sizeId),
    [sizes, form.sizeId],
  );

  // Сбрасываем подкатегорию и размер при смене категории
  useEffect(() => {
    dispatch({ type: "RESET_SUBCATEGORY_AND_SIZE" });
  }, [form.categoryId]);

  // Сбрасываем размер при смене подкатегории
  useEffect(() => {
    dispatch({ type: "RESET_SIZE" });
  }, [form.subcategoryId]);

  // Обработчик изменения категории
  const handleCategoryChange = (newCategoryId: string) => {
    clearBasicError("category");
    dispatch({ type: "SET_FIELD", field: "categoryId", value: newCategoryId });

    setTimeout(() => {
      priceInputRef.current?.focus();
    }, 300);
  };

  // Обработчик изменения подкатегории
  const handleSubcategoryChange = (newSubcategoryId: string) => {
    clearBasicError("subcategory");
    dispatch({
      type: "SET_FIELD",
      field: "subcategoryId",
      value: newSubcategoryId,
    });

    setTimeout(() => {
      priceInputRef.current?.focus();
    }, 300);
  };

  // Обработчик изменения размера
  const handleSizeChange = (newSizeId: string) => {
    clearBasicError("size");
    dispatch({ type: "SET_FIELD", field: "sizeId", value: newSizeId });

    setTimeout(() => {
      priceInputRef.current?.focus();
    }, 300);
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

      if (!form.categoryId) {
        nextErrors.category = "Выберите категорию";
      }

      if (activeSubcategories.length > 0 && !form.subcategoryId) {
        nextErrors.subcategory = "Выберите подкатегорию";
      }

      if (activeSizes.length > 0 && !form.sizeId) {
        nextErrors.size = "Выберите размер";
      }

      const price = Number(form.price);

      if (!form.price.trim()) {
        nextErrors.price = "Укажите цену";
      } else if (Number.isNaN(price) || price < 2500) {
        nextErrors.price = "Минимальная цена — 2500 ₸";
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
        // Имена для обратной совместимости
        category: selectedCategory?.name_ru || "",
        subcategory: selectedSubcategory?.name_ru || undefined,
        productSize: selectedSize?.manufacturer_size || undefined,
        // MongoDB IDs для будущей миграции
        categoryId: form.categoryId || undefined,
        subcategoryId: form.subcategoryId || undefined,
        sizeId: form.sizeId || undefined,
        price: Number(form.price),
        description: form.description.trim() || undefined,
        condition: form.condition || undefined,
        isFavorite: false,
        imagesArray:
          imagesArray.length > 0
            ? moveSelectedToStart(imagesArray, coverImageIndex)
            : undefined,
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
    if (form.selectedFiles.length === 0) setCoverImageIndex(0);
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    dispatch({ type: "REMOVE_FILE", index });

    setFilePreviews((prev) => prev.filter((_, i) => i !== index));

    setCoverImageIndex((prevCover) => {
      if (index === prevCover) return 0;
      if (index < prevCover) return Math.max(prevCover - 1, 0);
      return prevCover;
    });
  };

  return (
    <Container
      paddingTop={
        platformName === "desktop" ? paddingTop + 92 : paddingTop + 64
      }
    >
      {/* Header */}
      <Header title="Размещение: Продажа" showGoBackBtn />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop:
            platformName === "desktop" ? paddingTop + 92 : paddingTop + 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          backgroundColor: c.background,
        }}
      >
        <div>
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
            ref={contentRef}
            style={{
              padding: 16,
              backgroundColor: c.background,
            }}
          >
            {currentStep === "basic" && (
              <StepBasic
                contentRef={contentRef}
                form={form}
                dispatch={dispatch}
                basicErrors={basicErrors}
                clearBasicError={clearBasicError}
                categoryOptions={categoryOptions}
                subcategoryOptions={subcategoryOptions}
                sizeOptions={sizeOptions}
                showSubcategory={activeSubcategories.length > 0}
                showSize={activeSizes.length > 0}
                isLoadingCategories={isLoadingCategories}
                isLoadingSubcategories={isLoadingSubcategories}
                isLoadingSizes={isLoadingSizes}
                handleCategoryChange={handleCategoryChange}
                handleSubcategoryChange={handleSubcategoryChange}
                handleSizeChange={handleSizeChange}
                subcategoryInputRef={subcategoryInputRef}
                sizeInputRef={sizeInputRef}
                priceInputRef={priceInputRef}
              />
            )}

            {currentStep === "photos" && (
              <StepPhotos
                selectedFiles={form.selectedFiles}
                filePreviews={filePreviews}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
                coverImageIndex={coverImageIndex}
                onSetCoverImage={setCoverImageIndex}
              />
            )}

            {currentStep === "details" && (
              <StepDetails form={form} dispatch={dispatch} />
            )}

            {currentStep === "review" && (
              <StepReview
                form={form}
                categoryName={selectedCategory?.name_ru || ""}
                filePreviews={filePreviews}
                coverImageIndex={coverImageIndex}
              />
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div
          style={{
            position: "relative",
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
      </div>
    </Container>
  );
};

export default Create;
