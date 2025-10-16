import type { FC } from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import { Colors } from "@/theme/colors";
import { getTelegramUser } from "@/lib/telegram";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import ProductCard from "@/components/ProductCard";
import { useRequestCreateProduct } from "@/hooks/useRequestCreateProduct";
import { useRequestGetCategories } from "@/hooks/useRequestGetCategories";
import { useRequestGetGymnasticsCategories } from "@/hooks/useRequestGetGymnasticsCategories";
import { useRequestGetLeotardSizes } from "@/hooks/useRequestGetLeotardSizes";
import { testConnection, uploadFiles, PRODUCTS_BUCKET } from "@/lib/minio";
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

type StepType = "basic" | "photos" | "details" | "review";

const Create: FC = () => {
  const [currentStep, setCurrentStep] = useState<StepType>("basic");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productSize, setProductSize] = useState("");
  const [condition, setCondition] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const navigate = useNavigate();
  const paddingTop = useSafePaddingTop(48, 44);
  const platformName = useSafePlatform();

  const { createProduct } = useRequestCreateProduct();
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
    if (category !== "Гимнастика") {
      setSubcategory("");
      setProductSize("");
    }
  }, [category]);

  // Очищаем размер купальника при изменении подкатегории
  useEffect(() => {
    if (subcategory !== "Купальник") {
      setProductSize("");
    }
  }, [subcategory]);

  // Обработчик изменения категории
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    // Если выбрана не гимнастика, очищаем подкатегорию и размер
    if (newCategory !== "Гимнастика") {
      setSubcategory("");
      setProductSize("");
    }
  };

  // Обработчик изменения подкатегории
  const handleSubcategoryChange = (newSubcategory: string) => {
    setSubcategory(newSubcategory);
    // Если выбрана не купальник, очищаем размер
    if (newSubcategory !== "Купальник") {
      setProductSize("");
    }
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
    if (!productName.trim() || !category || !price.trim()) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

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

      const productData = {
        name: productName.trim(),
        category,
        subcategory: subcategory || undefined, // Добавляем подкатегорию гимнастики, если выбрана
        productSize: productSize ? Number(productSize) : undefined, // Добавляем размер купальника, если выбран
        price: Number(price),
        description: description.trim() || undefined,
        condition: condition || undefined,
        isFavorite: false,
        imagesArray: imagesArray.length > 0 ? imagesArray : undefined,
        createdBy, // Добавляем username пользователя Telegram
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
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              variant="outlined"
            />

            <CustomSelect
              label="Категория"
              value={category}
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

            {/* Подкатегории гимнастики - показываем только если выбрана Гимнастика */}
            {category === "Гимнастика" && (
              <CustomSelect
                label="Подкатегория"
                value={subcategory}
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
            {category === "Гимнастика" && subcategory === "Купальник" && (
              <CustomSelect
                label="Размер"
                value={productSize}
                onChange={setProductSize}
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              slotProps={{ htmlInput: { pattern: "[0-9]*" } }}
              fullWidth
              variant="outlined"
              helperText="Укажите цену в тенге"
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
              label="Описание товара"
              placeholder="Опишите товар подробно: состояние, размер, особенности..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={6}
              fullWidth
              variant="outlined"
            />

            <CustomSelect
              label="Состояние"
              value={condition}
              onChange={setCondition}
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
                    selectedFiles.length > 0
                      ? URL.createObjectURL(selectedFiles[0])
                      : "https://picsum.photos/600?preview",
                  category: category || "Без категории",
                  title: productName || "Название товара",
                  price: price
                    ? `${Number(price).toLocaleString("ru-RU")} ₸`
                    : "0 ₸",
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

            {condition && (
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
                  {condition}
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
    </Container>
  );
};

export default Create;
