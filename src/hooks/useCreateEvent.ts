// sharity-web/src/hooks/useCreateEvent.ts

import { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

export interface CreateEventPayload {
  name: string;
  category: string;
  eventType: string;
  date: string;
  time?: string;
  url?: string;
  description?: string;
  location: string;
  locationCoordinates?: [number, number];
  imagesArray?: string[];
  createdBy?: string;
}

export const useCreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (data: CreateEventPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(new URL("/api/events", API_BASE_URL), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const created = await res.json();
      return { success: true as const, id: created.id as string };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при создании события";
      setError(errorMessage);
      return { success: false as const, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { createEvent, isLoading, error };
};
