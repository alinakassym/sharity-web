// sharity-web/src/components/StepContacts.tsx

import type { FC, Dispatch } from "react";
import { TextField } from "@mui/material";
import PhoneField from "@/components/PhoneField";

type CreateFormAction = {
  type: "SET_FIELD";
  field: "contactName" | "contactPhone";
  value: string;
};

type ContactErrors = {
  contactName?: string;
  contactPhone?: string;
};

interface StepContactsProps {
  form: {
    contactName: string;
    contactPhone: string;
  };
  dispatch: Dispatch<CreateFormAction>;
  contactErrors: ContactErrors;
  clearContactError: (field: keyof ContactErrors) => void;
}

export const StepContacts: FC<StepContactsProps> = ({
  form,
  dispatch,
  contactErrors,
  clearContactError,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextField
        label="Имя для связи *"
        placeholder="Ваше имя"
        value={form.contactName}
        onChange={(e) => {
          clearContactError("contactName");
          dispatch({
            type: "SET_FIELD",
            field: "contactName",
            value: e.target.value,
          });
        }}
        error={Boolean(contactErrors.contactName)}
        helperText={contactErrors.contactName}
        fullWidth
        variant="outlined"
      />

      <PhoneField
        label="Телефон для связи *"
        value={form.contactPhone}
        onChange={(value) => {
          clearContactError("contactPhone");
          dispatch({ type: "SET_FIELD", field: "contactPhone", value });
        }}
        error={Boolean(contactErrors.contactPhone)}
        helperText={contactErrors.contactPhone}
        fullWidth
      />
    </div>
  );
};
