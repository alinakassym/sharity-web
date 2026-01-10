// sharity-web/src/components/StepCourseLocation.tsx

import type { FC } from "react";
import { forwardRef } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import { IMaskInput } from "react-imask";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

type LocationItem = {
  location: string;
  locationCoordinates: [number, number];
};

interface PhoneMaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PhoneMask = forwardRef<HTMLInputElement, PhoneMaskProps>(
  function PhoneMask(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="+7 (000) 000-00-00"
        definitions={{
          "0": /[0-9]/,
        }}
        inputRef={ref}
        onAccept={(value: unknown) =>
          onChange({ target: { name: props.name, value: value as string } })
        }
        overwrite
      />
    );
  },
);

type LocationErrors = {
  locations?: string;
  contacts?: string;
};

interface StepCourseLocationProps {
  locations: LocationItem[];

  phone: string;
  whatsapp: string;
  telegram: string;

  onOpenLocationModal: () => void;
  onRemoveLocation: (index: number) => void;

  onChangePhone: (value: string) => void;
  onChangeWhatsapp: (value: string) => void;
  onChangeTelegram: (value: string) => void;

  locationErrors: LocationErrors;
  clearLocationError: (field: keyof LocationErrors) => void;
}

export const StepCourseLocation: FC<StepCourseLocationProps> = ({
  locations,
  phone,
  whatsapp,
  telegram,
  onOpenLocationModal,
  onRemoveLocation,
  onChangePhone,
  onChangeWhatsapp,
  onChangeTelegram,
  locationErrors,
  clearLocationError,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Список добавленных адресов */}
      {locations.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {locations.map((loc, index) => (
            <div
              key={`${loc.location}-${index}`}
              style={{
                padding: 16,
                backgroundColor: c.surfaceColor,
                borderRadius: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: c.text,
                  }}
                >
                  {loc.location}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 12,
                    color: c.lightText,
                  }}
                >
                  {loc.locationCoordinates[0].toFixed(6)},{" "}
                  {loc.locationCoordinates[1].toFixed(6)}
                </p>
              </div>

              <IconButton
                onClick={() => onRemoveLocation(index)}
                size="small"
                sx={{
                  borderColor: c.error,
                  borderWidth: 1,
                  borderStyle: "solid",
                  backgroundColor: `${c.error}20`,
                }}
              >
                <VuesaxIcon name="close" size={16} color={c.error} />
              </IconButton>
            </div>
          ))}
        </div>
      )}

      {/* Кнопка добавить адрес */}
      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          clearLocationError("locations");
          onOpenLocationModal();
        }}
        startIcon={<VuesaxIcon name="location" size={20} color={c.primary} />}
      >
        Добавить адрес
      </Button>
      {locationErrors.locations && (
        <p style={{ margin: "-8px 12px 0", fontSize: 12, color: c.error }}>
          {locationErrors.locations}
        </p>
      )}

      {/* Контакты */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 24,
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
          Контакты
        </h3>

        <TextField
          label="Телефон"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => {
            clearLocationError("contacts");
            onChangePhone(e.target.value);
          }}
          fullWidth
          variant="outlined"
          style={{ marginBottom: 16 }}
          slotProps={{
            input: {
              inputComponent: PhoneMask as never,
            },
          }}
        />

        <TextField
          label="WhatsApp"
          placeholder="+7 (___) ___-__-__"
          value={whatsapp}
          onChange={(e) => {
            clearLocationError("contacts");
            onChangeWhatsapp(e.target.value);
          }}
          fullWidth
          variant="outlined"
          style={{ marginBottom: 16 }}
          slotProps={{
            input: {
              inputComponent: PhoneMask as never,
            },
          }}
        />

        <TextField
          label="Telegram"
          placeholder="@username"
          value={telegram}
          onChange={(e) => {
            clearLocationError("contacts");
            onChangeTelegram(e.target.value);
          }}
          fullWidth
          variant="outlined"
        />
        {locationErrors.contacts && (
          <p style={{ margin: "8px 12px 0", fontSize: 12, color: c.error }}>
            {locationErrors.contacts}
          </p>
        )}
      </div>
    </div>
  );
};
