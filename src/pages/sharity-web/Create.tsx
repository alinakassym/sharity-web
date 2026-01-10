// sharity-web/src/pages/sharity-web/Create.tsx

import type { FC } from "react";
import { useState, useEffect, useMemo, useRef, useReducer } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import ProductCard from "@/components/ProductCard";
import { useRequestGetCategories } from "@/hooks/useRequestGetCategories";
import { useRequestGetGymnasticsCategories } from "@/hooks/useRequestGetGymnasticsCategories";
import { useRequestGetLeotardSizes } from "@/hooks/useRequestGetLeotardSizes";
import { PRODUCTS_BUCKET, testConnection, uploadFiles } from "@/lib/minio";
import Header from "@/components/Header";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import Container from "@/components/Container";
import CustomSelect from "@/components/CustomSelect";
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
    price?: string;
  }>({});

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
  const isBasicValid =
    form.productName.trim().length > 0 &&
    form.category.trim().length > 0 &&
    Number(form.price) > 0;

  const canGoNext = useMemo(() => {
    if (currentStep === "basic") return isBasicValid;
    return true;
  }, [currentStep, isBasicValid]);

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
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label="Название товара *"
              placeholder="Введите название товара"
              value={form.productName}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "productName",
                  value: e.target.value,
                })
              }
              error={Boolean(basicErrors.productName)}
              helperText={basicErrors.productName}
              fullWidth
              variant="outlined"
            />

            <CustomSelect
              label="Категория"
              value={form.category}
              onChange={handleCategoryChange}
              options={categoryOptions.map((cat) => ({
                value: cat.name_ru,
                label: cat.name_ru,
              }))}
              placeholder={
                isLoadingCategories
                  ? "Загрузка категорий..."
                  : "Выберите категорию"
              }
              disabled={isLoadingCategories}
              required
              searchable
            />
            {basicErrors.category && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: c.error }}>
                {basicErrors.category}
              </p>
            )}

            {/* Подкатегории гимнастики - показываем только если выбрана Гимнастика */}
            {form.category === "Гимнастика" && (
              <CustomSelect
                label="Подкатегория"
                value={form.subcategory}
                onChange={handleSubcategoryChange}
                options={gymnasticsSubcategoryOptions.map((cat) => ({
                  value: cat.name_ru,
                  label: cat.name_ru,
                }))}
                placeholder={
                  isLoadingGymnasticsCategories
                    ? "Загрузка подкатегорий..."
                    : "Выберите подкатегорию"
                }
                disabled={isLoadingGymnasticsCategories}
                searchable
              />
            )}

            {/* Размеры купальников - показываем только если выбрана Гимнастика и Купальник */}
            {form.category === "Гимнастика" &&
              form.subcategory === "Купальник" && (
                <CustomSelect
                  label="Размер"
                  value={form.productSize}
                  onChange={(value) => {
                    dispatch({
                      type: "SET_FIELD",
                      field: "productSize",
                      value,
                    });
                    setTimeout(() => {
                      priceInputRef.current?.focus();
                    }, 300);
                  }}
                  options={leotardSizeOptions}
                  placeholder={
                    isLoadingLeotardSizes
                      ? "Загрузка размеров..."
                      : "Выберите размер"
                  }
                  disabled={isLoadingLeotardSizes}
                  searchable
                />
              )}

            <TextField
              label="Цена *"
              placeholder="0"
              type="number"
              inputMode="numeric"
              value={form.price}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "price",
                  value: e.target.value,
                })
              }
              error={Boolean(basicErrors.price)}
              helperText={basicErrors.price || "Укажите цену в тенге"}
              slotProps={{ htmlInput: { pattern: "[0-9]*" } }}
              fullWidth
              variant="outlined"
              inputRef={priceInputRef}
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
                Добавьте фотографии
              </p>
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: 14,
                  color: c.lightText,
                }}
              >
                Выберите фотографии товара
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

            {form.selectedFiles.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: 16,
                    color: c.text,
                  }}
                >
                  Выбранные изображения ({form.selectedFiles.length}):
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                    gap: 8,
                  }}
                >
                  {form.selectedFiles.map((file, index) => (
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
              label="Описание товара"
              placeholder="Опишите товар подробно: состояние, размер, особенности..."
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

            <CustomSelect
              label="Состояние"
              value={form.condition}
              onChange={(value) =>
                dispatch({ type: "SET_FIELD", field: "condition", value })
              }
              options={[
                { value: "Новое", label: "Новое" },
                { value: "Отличное", label: "Отличное" },
                { value: "Хорошее", label: "Хорошее" },
                { value: "Удовлетворительное", label: "Удовлетворительное" },
              ]}
              placeholder="Выберите состояние"
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
              <ProductCard
                showHeartBtn={false}
                product={{
                  id: "preview",
                  image:
                    form.selectedFiles.length > 0
                      ? URL.createObjectURL(form.selectedFiles[0])
                      : "https://picsum.photos/600?preview",
                  category: form.category || "Без категории",
                  title: form.productName || "Название товара",
                  price: form.price
                    ? `${Number(form.price).toLocaleString("ru-RU")} ₸`
                    : "0 ₸",
                }}
              />
            </div>

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

            {form.condition && (
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
                    margin: "0 0 8px",
                  }}
                >
                  Состояние
                </h4>
                <p
                  style={{
                    fontSize: 14,
                    color: c.text,
                    margin: 0,
                  }}
                >
                  {form.condition}
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
                  {form.selectedFiles.slice(1).map((file, index) => (
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
          disabled={isPublishing || !canGoNext}
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
