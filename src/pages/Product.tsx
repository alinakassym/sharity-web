// src/pages/Product.tsx

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
import Carousel from "@/components/Carousel";

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
              : "",
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

  // Функция для поиска роста по размеру купальника
  const getHeightForSize = (size: number): string | undefined => {
    const sizeData = leotardSizes.find((s) => s.size === size);
    return sizeData?.height;
  };

  const product = productData
    ? {
        id: productData.id,
        images:
          productData.imagesArray?.map((imageUrl, index) => ({
            id: `${productData.id}-${index}`,
            image: imageUrl,
            alt: productData.name,
          })) || [],
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
    <Container paddingTop={isTelegram ? 110 : 64}>
      {/* Header с кнопкой назад */}
      <ProductHeader onGoBack={handleBackClick} backTo={backTo} />

      {/* Контент продукта */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Изображение */}
        <div>
          <Carousel
            items={product.images}
            aspectRatio={320 / 360}
            autoPlay={false}
          />
        </div>

        {/* Информация о товаре */}
        <div
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
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
            paddingLeft: 16,
            paddingRight: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
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
