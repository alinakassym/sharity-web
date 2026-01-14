// sharity-web/src/components/StepDetails.tsx

import type { FC } from "react";
import type { Dispatch } from "react";
import { TextField } from "@mui/material";
import ModalSelect from "./ModalSelect";

type CreateFormAction = {
  type: "SET_FIELD";
  field: "description" | "condition";
  value: string;
};

interface StepDetailsProps {
  form: {
    description: string;
    condition: string;
  };
  dispatch: Dispatch<CreateFormAction>;
}

export const StepDetails: FC<StepDetailsProps> = ({ form, dispatch }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextField
        label="Описание товара"
        placeholder="Опишите товар подробно: состояние, размер, особенности..."
        value={form.description}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field: "description",
            value: e.target.value,
          })
        }
        multiline
        rows={6}
        fullWidth
        variant="outlined"
      />

      <ModalSelect
        label="Состояние"
        value={form.condition}
        onChange={(value) =>
          dispatch({ type: "SET_FIELD", field: "condition", value })
        }
        options={[
          { value: "Новое", label: "Новое" },
          { value: "Отличное", label: "Отличное" },
          { value: "Хорошее", label: "Хорошее" },
          { value: "Удовлетворительное", label: "Удовлетворительное" },
        ]}
        placeholder="Выберите состояние"
      />
    </div>
  );
};
