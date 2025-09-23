import type { FC } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/VuesaxIcon";
import ProductHeader from "@/components/ProductHeader";
import { useRequestGetProduct } from "@/hooks/useRequestGetProduct";

const Product: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const imageParam = searchParams.get("image");

  const navigate = useNavigate();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

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
      hash = ((hash << 5) - hash) + char;
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
          (productData.imagesArray && productData.imagesArray.length > 0)
            ? productData.imagesArray[0]
            : imageParam ||
              productData.image ||
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
          position: "fixed",
          left: 0,
          right: 0,
        }}
      >
        <ProductHeader onGoBack={handleBackClick} />
        <div style={{ padding: 16 }}>Загрузка…</div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section
        style={{
          position: "fixed",
          left: 0,
          right: 0,
        }}
      >
        <ProductHeader onGoBack={handleBackClick} />
        <div style={{ padding: 16, color: colors.lightText }}>
          {error || "Продукт не найден"}
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        position: "fixed",
        left: 0,
        right: 0,
      }}
    >
      {/* Header с кнопкой назад */}
      <ProductHeader onGoBack={handleBackClick} />

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
              border: `1px solid ${colors.border}`,
            }}
          />
        </div>

        {/* Информация о товаре */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 14,
              color: colors.lightText,
            }}
          >
            {product.category}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: colors.text,
            }}
          >
            {product.title}
          </h2>

          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: colors.primary,
            }}
          >
            {product.price}
          </div>

          <div
            style={{
              fontSize: 16,
              lineHeight: "1.5",
              color: colors.text,
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
              backgroundColor: colors.primary,
              color: colors.lighter,
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
              backgroundColor: colors.controlColor,
              color: colors.text,
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VuesaxIcon name="search" size={20} color={colors.text} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Product;
