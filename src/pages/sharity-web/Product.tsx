import type { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/VuesaxIcon";
import ProductHeader from "@/components/ProductHeader";

const Product: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const handleBackClick = () => {
    navigate(-1);
  };

  // Здесь будет запрос данных о продукте по id
  // Пока используем заглушку
  const product = {
    id: id || "1",
    image: `https://picsum.photos/600?${id || "1"}`,
    category: "Спорт/Гимнастика",
    title: "Костюм размер 23",
    price: "32 000 ₸",
    description:
      "Костюм для гимнастики, размер 23. Отличное состояние, подходит для тренировок и выступлений.",
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      {/* Header с кнопкой назад */}
      <ProductHeader title={product.title} onGoBack={handleBackClick} />

      {/* Контент продукта */}
      <div style={{ padding: "16px" }}>
        {/* Изображение */}
        <div style={{ marginBottom: "24px" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              fontSize: "14px",
              color: colors.lightText,
            }}
          >
            {product.category}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 600,
              color: colors.text,
            }}
          >
            {product.title}
          </h2>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: colors.primary,
            }}
          >
            {product.price}
          </div>

          <div
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              color: colors.text,
              marginTop: "16px",
            }}
          >
            {product.description}
          </div>
        </div>

        {/* Кнопки действий */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "32px",
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
