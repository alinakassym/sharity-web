// sharity-web/src/components/StepReview.tsx

import type { FC } from "react";
import ProductCard from "@/components/ProductCard";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

interface StepReviewProps {
  form: {
    category: string;
    productName: string;
    price: string;
    description: string;
    condition: string;
    selectedFiles: File[];
  };
  filePreviews: Array<{ file: File; url: string }>;
}

export const StepReview: FC<StepReviewProps> = ({ form, filePreviews }) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const previewImage =
    filePreviews[0]?.url ?? "https://picsum.photos/600?preview";
  const additionalPreviews = filePreviews.slice(1);

  return (
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
          Предпросмотр
        </h3>
        <p style={{ fontSize: 14, color: c.lightText, margin: 0 }}>
          Проверьте, как будет выглядеть публикация
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <ProductCard
          showHeartBtn={false}
          product={{
            id: "preview",
            image: previewImage,
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
