// shirarity-web/src/components/StepCourseReview.tsx

import { type FC, type Dispatch, useState } from "react";
import { Switch, FormControlLabel } from "@mui/material";
import CourseCard from "@/components/CourseCard";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { CustomTextField } from "./CustomTextField";

type CreateCourseSetFieldAction = {
  type: "SET_FIELD";
  field: "shortDescription";
  value: string;
};

type LocationItem = {
  location: string;
  locationCoordinates: [number, number];
};

interface StepCourseReviewProps {
  form: {
    category: string;
    courseName: string;
    description: string;
    shortDescription: string;
    selectedFiles: File[];
    locations: LocationItem[];

    priceText: string;
    scheduleText: string;

    phone: string;
    whatsapp: string;
    telegram: string;
  };
  dispatch: Dispatch<CreateCourseSetFieldAction>;
  filePreviews: Array<{ file: File; url: string }>;
  // Поля только для отображения в CourseCard (не редактируются)
  ageFrom?: number;
  ageTo?: number;
  priceFrom?: number;
}

export const StepCourseReview: FC<StepCourseReviewProps> = ({
  form,
  dispatch,
  filePreviews,
  ageFrom,
  ageTo,
  priceFrom,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  const previewImage =
    filePreviews[0]?.url ?? "https://picsum.photos/600?preview";

  const hasContacts = Boolean(form.phone || form.whatsapp || form.telegram);
  const hasMeta = Boolean(form.priceText || form.scheduleText);

  const MAX_SHORT_DESC_LENGTH = 100;
  const remainingChars = MAX_SHORT_DESC_LENGTH - form.shortDescription.length;

  // Состояние для переключателя короткого описания
  const [showShortDescription, setShowShortDescription] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          maxWidth: "100%",
          display: "grid",
          gridTemplateColumns: "1fr",
        }}
      >
        <CourseCard
          showHeartBtn={false}
          isLiked={false}
          onHeartPress={() => {}}
          course={{
            id: "preview",
            image: previewImage,
            category: form.category || "Без категории",
            title: form.courseName || "Название курса",
            ageFrom: ageFrom,
            ageTo: ageTo,
            priceFrom: priceFrom,
            priceText: form.priceText || undefined,
            location: form.locations[0]?.location || undefined,
            phone: form.phone || undefined,
            whatsapp: form.whatsapp || undefined,
            telegram: form.telegram || undefined,
            shortDescription: showShortDescription
              ? form.shortDescription || undefined
              : undefined,
          }}
        />
      </div>

      {/* Переключатель и инпут для короткого описания */}
      <div
        style={{
          padding: 16,
          backgroundColor: c.surfaceColor,
          borderRadius: 12,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={showShortDescription}
              onChange={(e) => setShowShortDescription(e.target.checked)}
            />
          }
          label="Показать короткое описание или анонс"
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: 14,
              fontWeight: 500,
              color: c.text,
            },
          }}
        />

        {showShortDescription && (
          <div style={{ marginTop: 16 }}>
            <CustomTextField
              maxSymbols={100}
              fullWidth
              multiline
              rows={3}
              label="Короткое описание"
              placeholder="Введите короткое описание или анонс (до 100 символов)"
              value={form.shortDescription}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_SHORT_DESC_LENGTH) {
                  dispatch({
                    type: "SET_FIELD",
                    field: "shortDescription",
                    value: value,
                  });
                }
              }}
              helperText={`Осталось символов: ${remainingChars}`}
              sx={{
                "& .MuiFormLabel-root": {
                  backgroundColor: c.surfaceColor,
                },
                "& .MuiFormHelperText-root": {
                  color: remainingChars < 20 ? "#FFA500" : c.lightText,
                  fontWeight: remainingChars < 20 ? 600 : 400,
                },
              }}
            />
          </div>
        )}
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
