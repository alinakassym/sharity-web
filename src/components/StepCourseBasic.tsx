import type { Dispatch, FC } from "react";
import { TextField } from "@mui/material";
import CustomSelect from "@/components/CustomSelect";

type CreateCourseSetFieldAction = {
  type: "SET_FIELD";
  field: "courseName" | "category";
  value: string;
};

interface StepCourseBasicProps {
  form: {
    courseName: string;
    category: string;
  };
  dispatch: Dispatch<CreateCourseSetFieldAction>;
}

export const StepCourseBasic: FC<StepCourseBasicProps> = ({
  form,
  dispatch,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextField
        label="Название *"
        placeholder="Введите название"
        value={form.courseName}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field: "courseName",
            value: e.target.value,
          })
        }
        fullWidth
        variant="outlined"
      />

      <CustomSelect
        label="Категория"
        value={form.category}
        onChange={(value) =>
          dispatch({
            type: "SET_FIELD",
            field: "category",
            value,
          })
        }
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
      />
    </div>
  );
};
