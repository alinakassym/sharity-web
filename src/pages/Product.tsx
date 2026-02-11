// sharity-web/src/pages/Product.tsx

import type { FC } from "react";
import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Divider } from "@mui/material";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import ProductHeader from "@/components/ProductHeader";
import { useProduct } from "@/hooks/useProduct";
import { useSizes } from "@/hooks/useSizes";
import Container from "@/components/Container";
import Carousel from "@/components/Carousel";
import SizeChartModal from "@/components/SizeChartModal";

const DetailRow: FC<{
  label: string;
  value: string;
  c: (typeof Colors)[keyof typeof Colors];
}> = ({ label, value, c }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
    <Typography sx={{ fontSize: 14, color: c.lightText, flexShrink: 0 }}>
      {label}
    </Typography>
    <Typography
      sx={{ fontSize: 14, fontWeight: 500, color: c.text, textAlign: "right" }}
    >
      {value}
    </Typography>
  </Box>
);

const Product: FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];

  const isTelegram = isTelegramApp();

  const location = useLocation();

  const backTo = (location.state as { from?: string })?.from || "/";

  const { product: productData, isLoading, error } = useProduct(id);
  const { sizes } = useSizes(
    productData?.categoryId ?? null,
    productData?.subcategoryId ?? null,
  );
  const activeSizes = sizes.filter((s) => s.is_active);

  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  // Форматирование цены
  const KZT = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  });

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
        condition: productData.condition || "",
        contactName: productData.contactName || "",
        contactPhone: productData.contactPhone || "",
        createdAt: productData.createdAt
          ? new Date(productData.createdAt).toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
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
          paddingBottom: 32,
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
                margin: 0,
              }}
            >
              Размер: {product.size}
            </p>
          )}
          {activeSizes.length > 0 && (
            <button
              onClick={() => setSizeChartOpen(true)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontSize: 14,
                fontWeight: 600,
                color: c.primary,
                cursor: "pointer",
                textAlign: "left",
                textDecoration: "underline",
              }}
            >
              Таблица размеров
            </button>
          )}
          {product.description && (
            <Typography sx={{ fontSize: 15, color: c.text, mt: 1 }}>
              {product.description}
            </Typography>
          )}
        </div>

        {/* Детали товара */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography
            sx={{ fontWeight: 700, fontSize: 16, color: c.text, mb: 1.5 }}
          >
            Информация о товаре
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <DetailRow label="Категория" value={product.category} c={c} />
            {product.subcategory && (
              <DetailRow
                label="Подкатегория"
                value={product.subcategory}
                c={c}
              />
            )}
            {product.size && (
              <DetailRow label="Размер" value={product.size} c={c} />
            )}
            {product.condition && (
              <DetailRow label="Состояние" value={product.condition} c={c} />
            )}
            {product.createdAt && (
              <DetailRow
                label="Дата создания"
                value={product.createdAt}
                c={c}
              />
            )}
          </Box>
        </Box>

        {/* Контакты продавца */}
        {(product.contactName || product.contactPhone) && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography
              sx={{ fontWeight: 700, fontSize: 16, color: c.text, mb: 1.5 }}
            >
              Контакты продавца
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {product.contactName && (
                <DetailRow label="Имя" value={product.contactName} c={c} />
              )}
              {product.contactPhone && (
                <DetailRow label="Телефон" value={product.contactPhone} c={c} />
              )}
            </Box>
          </Box>
        )}

        {/* Кнопки действий */}
        <div
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        ></div>
      </div>

      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        sizes={activeSizes}
      />
    </Container>
  );
};

export default Product;
