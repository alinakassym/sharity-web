// shirarity-web/src/components/StepCourseReview.tsx

import type { FC } from "react";
import CourseCard from "@/components/CourseCard";

type ColorsShape = {
  surfaceColor: string;
  lightText: string;
  text: string;
};

type LocationItem = {
  location: string;
  locationCoordinates: [number, number];
};

interface StepCourseReviewProps {
  c: ColorsShape;
  form: {
    category: string;
    courseName: string;
    description: string;
    selectedFiles: File[];
    locations: LocationItem[];

    priceText: string;
    scheduleText: string;

    phone: string;
    whatsapp: string;
    telegram: string;
  };
  filePreviews: Array<{ file: File; url: string }>;
}

export const StepCourseReview: FC<StepCourseReviewProps> = ({
  c,
  form,
  filePreviews,
}) => {
  const previewImage =
    filePreviews[0]?.url ?? "https://picsum.photos/600?preview";

  const hasContacts = Boolean(form.phone || form.whatsapp || form.telegram);
  const hasMeta = Boolean(form.priceText || form.scheduleText);

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
        <CourseCard
          showHeartBtn={false}
          course={{
            id: "preview",
            image: previewImage,
            category: form.category || "Без категории",
            title: form.courseName || "Название курса",
          }}
        />
      </div>

      {form.description && (
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
            Описание
          </h4>
          <p
            style={{ fontSize: 14, color: c.text, margin: 0, lineHeight: 1.5 }}
          >
            {form.description}
          </p>
        </div>
      )}

      {form.locations.length > 0 && (
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
            Локации ({form.locations.length})
          </h4>

          <div style={{ display: "grid", gap: 8 }}>
            {form.locations.map((loc, index) => (
              <div
                key={`${loc.location}-${index}`}
                style={{ fontSize: 14, color: c.text }}
              >
                {index + 1}. {loc.location}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasMeta && (
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
            Детали
          </h4>

          <div style={{ display: "grid", gap: 8, fontSize: 14, color: c.text }}>
            {form.priceText && <div>Цена: {form.priceText}</div>}
            {form.scheduleText && <div>Расписание: {form.scheduleText}</div>}
          </div>
        </div>
      )}

      {hasContacts && (
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
            Контакты
          </h4>

          <div style={{ display: "grid", gap: 8, fontSize: 14, color: c.text }}>
            {form.phone && <div>Телефон: {form.phone}</div>}
            {form.whatsapp && <div>WhatsApp: {form.whatsapp}</div>}
            {form.telegram && <div>Telegram: {form.telegram}</div>}
          </div>
        </div>
      )}
    </div>
  );
};
