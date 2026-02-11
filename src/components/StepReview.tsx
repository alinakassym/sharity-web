// src/components/StepReview.tsx

import type { FC } from "react";
import ProductCard from "@/components/ProductCard";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

interface StepReviewProps {
  form: {
    productName: string;
    price: string;
    description: string;
    condition: string;
    selectedFiles: File[];
    saleType: "group" | "individual";
    quantity: string;
    contactName: string;
    contactPhone: string;
  };
  categoryName: string;
  filePreviews: Array<{ file: File; url: string }>;
  coverImageIndex: number;
}

export const StepReview: FC<StepReviewProps> = ({
  form,
  categoryName,
  filePreviews,
  coverImageIndex,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const previewImage =
    filePreviews[coverImageIndex]?.url ?? "https://picsum.photos/600?preview";
  const additionalPreviews = [
    ...filePreviews.slice(0, coverImageIndex),
    ...filePreviews.slice(coverImageIndex + 1),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ProductCard
          showHeartBtn={false}
          product={{
            id: "preview",
            image: previewImage,
            category: categoryName || "Без категории",
            title: form.productName || "Название товара",
            price: form.price
              ? `${Number(form.price).toLocaleString("ru-RU")} ₸`
              : "0 ₸",
          }}
        />
      </div>

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
          Тип продажи
        </h4>
        <p style={{ fontSize: 14, color: c.text, margin: 0 }}>
          {form.saleType === "group"
            ? `Для группы (${form.quantity} шт.)`
            : "Индивидуально"}
        </p>
      </div>

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
          Контактные данные
        </h4>
        <p style={{ fontSize: 14, color: c.text, margin: 0, lineHeight: 1.5 }}>
          {form.contactName}, {form.contactPhone}
        </p>
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
            style={{ fontSize: 14, color: c.text, margin: 0, lineHeight: 1.5 }}
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
          <p style={{ fontSize: 14, color: c.text, margin: 0 }}>
            {form.condition}
          </p>
        </div>
      )}

      {additionalPreviews.length > 0 && (
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
            Дополнительные фото ({additionalPreviews.length})
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
              gap: 8,
            }}
          >
            {additionalPreviews.map((p, index) => (
              <img
                key={index}
                src={p.url}
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
  );
};
