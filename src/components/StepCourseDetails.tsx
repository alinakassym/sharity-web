// shirarity-web/src/components/StepCourseDetails.tsx

import type { Dispatch, FC, SetStateAction } from "react";
import { TextField } from "@mui/material";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

type CreateCourseSetFieldAction = {
  type: "SET_FIELD";
  field: "description" | "priceText" | "scheduleText";
  value: string;
};

type DetailsErrors = {
  description?: string;
};

interface StepCourseDetailsProps {
  form: {
    description: string;
    priceText: string;
    scheduleText: string;
  };

  dispatch: Dispatch<CreateCourseSetFieldAction>;

  ageFrom: number | undefined;
  setAgeFrom: Dispatch<SetStateAction<number | undefined>>;

  ageTo: number | undefined;
  setAgeTo: Dispatch<SetStateAction<number | undefined>>;

  priceFrom: number | undefined;
  setPriceFrom: Dispatch<SetStateAction<number | undefined>>;

  detailsErrors: DetailsErrors;
  clearDetailsError: (field: keyof DetailsErrors) => void;
}

export const StepCourseDetails: FC<StepCourseDetailsProps> = ({
  form,
  dispatch,
  ageFrom,
  setAgeFrom,
  ageTo,
  setAgeTo,
  priceFrom,
  setPriceFrom,
  detailsErrors,
  clearDetailsError,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextField
        label="Описание"
        placeholder="Опишите подробно"
        value={form.description}
        onChange={(e) => {
          clearDetailsError("description");
          dispatch({
            type: "SET_FIELD",
            field: "description",
            value: e.target.value,
          });
        }}
        error={Boolean(detailsErrors.description)}
        helperText={detailsErrors.description}
        multiline
        rows={6}
        fullWidth
        variant="outlined"
      />

      {/* ➕ НОВЫЕ поля: Возрастная группа */}
      <div
        style={{
          paddingTop: 24,
          marginTop: 8,
          borderTop: `1px solid ${c.surfaceColor}`,
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: c.text,
            margin: "0 0 16px",
          }}
        >
          Возрастная группа
        </h3>
        <div style={{ display: "flex", gap: 16 }}>
          <TextField
            label="От (лет)"
            type="number"
            placeholder="5"
            value={ageFrom ?? ""}
            onChange={(e) =>
              setAgeFrom(e.target.value ? Number(e.target.value) : undefined)
            }
            variant="outlined"
            style={{ flex: 1 }}
          />
          <TextField
            label="До (лет)"
            type="number"
            placeholder="12"
            value={ageTo ?? ""}
            onChange={(e) =>
              setAgeTo(e.target.value ? Number(e.target.value) : undefined)
            }
            variant="outlined"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {/* ➕ НОВЫЕ поля: Стоимость */}
      <div
        style={{
          paddingTop: 24,
          marginTop: 8,
          borderTop: `1px solid ${c.surfaceColor}`,
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: c.text,
            margin: "0 0 16px",
          }}
        >
          Стоимость
        </h3>
        <TextField
          label="Цена от (₸)"
          type="number"
          placeholder="15000"
          value={priceFrom ?? ""}
          onChange={(e) =>
            setPriceFrom(e.target.value ? Number(e.target.value) : undefined)
          }
          fullWidth
          variant="outlined"
          style={{ marginBottom: 16 }}
        />
        <TextField
          label="Описание цены (опционально)"
          placeholder="Например: абонемент 25 000₸/мес или цена по запросу"
          value={form.priceText}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "priceText",
              value: e.target.value,
            })
          }
          fullWidth
          multiline
          rows={2}
          variant="outlined"
        />
      </div>

      {/* ➕ НОВОЕ поле: Расписание */}
      <div
        style={{
          paddingTop: 24,
          marginTop: 8,
          borderTop: `1px solid ${c.surfaceColor}`,
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: c.text,
            margin: "0 0 16px",
          }}
        >
          Расписание
        </h3>
        <TextField
          label="Расписание"
          placeholder="Например: Пн–Сб 10:00–20:00"
          value={form.scheduleText}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "scheduleText",
              value: e.target.value,
            })
          }
          fullWidth
          multiline
          rows={2}
          variant="outlined"
        />
      </div>
    </div>
  );
};
