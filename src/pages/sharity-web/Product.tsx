// sharity-web/src/pages/sharity-web/Product.tsx

import type { FC } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import ProductHeader from "@/components/ProductHeader";
import { useRequestGetProduct } from "@/hooks/useRequestGetProduct";
import { useRequestGetLeotardSizes } from "@/hooks/useRequestGetLeotardSizes";
import Container from "@/components/Container";

const Product: FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];

  const isTelegram = isTelegramApp();

  const location = useLocation();

  const backTo = (location.state as { from?: string })?.from || "/";

  const { product: productData, isLoading, error } = useRequestGetProduct(id);
  const { sizes: leotardSizes } = useRequestGetLeotardSizes();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleBuyClick = () => {
    if (!productData) return;

    // Переходим на страницу оформления заказа
    navigate("/checkout", {
      state: {
        product: {
          id: productData.id,
          name: productData.name,
          price: Number(productData.price),
          image:
            productData.imagesArray && productData.imagesArray.length > 0
              ? productData.imagesArray[0]
              : productData.image ||
                `https://picsum.photos/600?${getImageIndex(productData.id)}`,
          category: productData.category || "",
        },
      },
    });
  };

  // Форматирование цены
  const KZT = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  });

  // Генерируем стабильный индекс для fallback картинки на основе ID
  const getImageIndex = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 1000) + 1;
  };

  // Функция для поиска роста по размеру купальника
  const getHeightForSize = (size: number): string | undefined => {
    const sizeData = leotardSizes.find((s) => s.size === size);
    return sizeData?.height;
  };

  const product = productData
    ? {
        id: productData.id,
        image:
          // Приоритет отображения изображений:
          // 1. Первое изображение из imagesArray
          // 2. Параметр image из URL
          // 3. Поле image (для совместимости)
          // 4. Fallback заглушка
          productData.imagesArray && productData.imagesArray.length > 0
            ? productData.imagesArray[0]
            : productData.image ||
              `https://picsum.photos/600?${getImageIndex(productData.id)}`,
        category: productData.category || "",
        subcategory: productData.subcategory || "",
        size: productData.productSize,
        title: productData.name || "",
        price: KZT.format(Number(productData.price) || 0),
        description: productData.description || "",
        imagesArray: productData.imagesArray || [],
      }
    : null;

  console.log("product: ", product);
  if (isLoading) {
    return (
      <section
        style={{
          paddingTop: isTelegram ? 112 : 64,
          minHeight: "100vh",
          paddingBottom: "160px",
          backgroundColor: c.background,
        }}
      >
        <ProductHeader onGoBack={handleBackClick} backTo={backTo} />
        <div style={{ padding: 16 }}>Загрузка…</div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section
        style={{
          paddingTop: isTelegram ? 112 : 64,
          minHeight: "100vh",
          paddingBottom: "160px",
          backgroundColor: c.background,
        }}
      >
        <ProductHeader onGoBack={handleBackClick} backTo={backTo} />
        <div style={{ padding: 16, color: c.lightText }}>
          {error || "Товар не найден"}
        </div>
      </section>
    );
  }

  return (
    <Container paddingTop={isTelegram ? 112 : 64}>
      {/* Header с кнопкой назад */}
      <ProductHeader onGoBack={handleBackClick} backTo={backTo} />

      {/* Контент продукта */}
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          height: "calc(100vh - 90px)",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Изображение */}
        <div style={{}}>
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "cover",
              borderRadius: "12px",
              border: `1px solid ${c.border}`,
            }}
          />
        </div>

        {/* Информация о товаре */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 14,
              color: c.lightText,
            }}
          >
            {product.category}
            {product.subcategory ? "/" + product.subcategory : ""}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: c.text,
            }}
          >
            {product.title}
          </h2>

          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: c.primary,
            }}
          >
            {product.price}
          </div>
          {product.size && (
            <p
              style={{
                fontSize: 16,
                color: c.text,
              }}
            >
              Размер: {product.size} {/* Размер купальника с ростом */}
              {product.category === "Гимнастика" &&
                product.subcategory === "Купальник" &&
                product.size &&
                getHeightForSize(product.size) &&
                ` (рост ${getHeightForSize(product.size)})`}
            </p>
          )}
          <div>
            <p
              style={{
                fontSize: 16,
                color: c.text,
              }}
            >
              {product.description}
            </p>
          </div>
        </div>

        {/* Кнопки действий */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 16,
            paddingBottom: 48,
          }}
        >
          {/* Кнопка покупки */}
          <button
            onClick={handleBuyClick}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: c.primary,
              color: c.lighter,
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <VuesaxIcon name="shopping-cart" size={20} color={c.lighter} />
            Купить
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Product;
