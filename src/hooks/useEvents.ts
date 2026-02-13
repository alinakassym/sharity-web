// sharity-web/src/hooks/useEvents.ts

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

export interface EventFromAPI {
  id: string;
  name: string;
  categoryId: string;
  eventTypeId: string;
  date: string;
  time?: string;
  url?: string;
  description?: string;
  location: string;
  locationCoordinates?: number[];
  imagesArray?: string[];
  isDeleted?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<EventFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(new URL("/api/events", API_BASE_URL));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: EventFromAPI[] = await res.json();
      setEvents(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось загрузить события",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refetch: fetchEvents };
};
