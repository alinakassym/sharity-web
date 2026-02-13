import type { FC, RefObject } from "react";
import { TextField } from "@mui/material";
import YandexMap from "@/components/YandexMap";

interface StepEventLocationProps {
  location: string;
  onLocationChange: (value: string) => void;
  onLocationSelect: (address: string, coordinates: [number, number]) => void;
  locationInputRef: RefObject<HTMLDivElement | null>;
}

export const StepEventLocation: FC<StepEventLocationProps> = ({
  location,
  onLocationChange,
  onLocationSelect,
  locationInputRef,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ width: "80%", alignSelf: "center" }}>
        <YandexMap
          apiKey={import.meta.env.VITE_YANDEX_MAPS_API_KEY}
          height={300}
          onLocationSelect={onLocationSelect}
        />
      </div>
      <TextField
        ref={locationInputRef}
        label="Локация/адрес *"
        placeholder="Введите локацию/адрес"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        onFocus={() => {
          setTimeout(() => {
            locationInputRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 400);
        }}
        fullWidth
        variant="outlined"
      />
    </div>
  );
};
