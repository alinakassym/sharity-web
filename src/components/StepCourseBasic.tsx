// src/components/StepCourseBasic.tsx

import type { Dispatch, FC } from "react";
import CustomSelect from "@/components/CustomSelect";
import { CustomTextField } from "./CustomTextField";

type CreateCourseSetFieldAction = {
  type: "SET_FIELD";
  field: "courseName" | "category";
  value: string;
};

type BasicErrors = {
  courseName?: string;
  category?: string;
};

interface StepCourseBasicProps {
  form: {
    courseName: string;
    category: string;
  };
  dispatch: Dispatch<CreateCourseSetFieldAction>;
  basicErrors: BasicErrors;
  clearBasicError: (field: keyof BasicErrors) => void;
}

export const StepCourseBasic: FC<StepCourseBasicProps> = ({
  form,
  dispatch,
  basicErrors,
  clearBasicError,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CustomTextField
        maxSymbols={50}
        label="Название *"
        placeholder="Введите название"
        value={form.courseName}
        onChange={(e) => {
          clearBasicError("courseName");
          dispatch({
            type: "SET_FIELD",
            field: "courseName",
            value: e.target.value,
          });
        }}
        error={Boolean(basicErrors.courseName)}
        helperText={basicErrors.courseName}
        fullWidth
        variant="outlined"
      />

      <CustomSelect
        label="Категория"
        value={form.category}
        onChange={(value) => {
          clearBasicError("category");
          dispatch({
            type: "SET_FIELD",
            field: "category",
            value,
          });
        }}
        options={[
          { value: "Гимнастика", label: "Гимнастика" },
          { value: "Танцы", label: "Танцы" },
          { value: "Балет", label: "Балет" },
          { value: "Волейбол", label: "Волейбол" },
          { value: "Теннис", label: "Теннис" },
          { value: "Футбол", label: "Футбол" },
          { value: "Хоккей", label: "Хоккей" },
          { value: "Бег", label: "Бег" },
        ]}
        placeholder="Выберите категорию"
        required
        searchable
        error={Boolean(basicErrors.category)}
        helperText={basicErrors.category}
      />
    </div>
  );
};
