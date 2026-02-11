// sharity-web/src/components/StepCourseLocation.tsx

import type { FC } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import PhoneField from "@/components/PhoneField";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

type LocationItem = {
  location: string;
  locationCoordinates: [number, number];
};

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

        <PhoneField
          label="Телефон"
          value={phone}
          onChange={(value) => {
            clearLocationError("contacts");
            onChangePhone(value);
          }}
          fullWidth
          sx={{ mb: 2 }}
        />

        <PhoneField
          label="WhatsApp"
          value={whatsapp}
          onChange={(value) => {
            clearLocationError("contacts");
            onChangeWhatsapp(value);
          }}
          fullWidth
          sx={{ mb: 2 }}
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
