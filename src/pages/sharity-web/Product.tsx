import type { FC } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import ProductHeader from "@/components/ProductHeader";
import { useRequestGetProduct } from "@/hooks/useRequestGetProduct";
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

  const handleBackClick = () => {
    navigate(-1);
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
        title: productData.name || "",
        price: KZT.format(Number(productData.price) || 0),
        description: productData.description || "",
        imagesArray: productData.imagesArray || [],
      }
    : null;

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
          {error || "Продукт не найден"}
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

          <div
            style={{
              fontSize: 16,
              lineHeight: "1.5",
              color: c.text,
              marginTop: 16,
            }}
          >
            {product.description}
          </div>
        </div>

        {/* Кнопки действий */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
            paddingBottom: 48,
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "16px",
              backgroundColor: c.primary,
              color: c.lighter,
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Связаться с продавцом
          </button>

          <button
            style={{
              padding: "16px",
              backgroundColor: c.controlColor,
              color: c.text,
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VuesaxIcon name="search" size={20} color={c.text} />
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Product;
