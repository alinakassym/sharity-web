// sharity-web/src/hooks/useEventTypes.ts

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

export interface EventTypeData {
  id: string;
  name_ru: string;
  name_en: string;
  is_active: boolean;
  order?: number;
}

export type CreateEventTypeData = Omit<EventTypeData, "id">;
export type UpdateEventTypeData = Partial<Omit<EventTypeData, "id">>;

export const useEventTypes = () => {
  const [eventTypes, setEventTypes] = useState<EventTypeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(new URL("/api/event-types", API_BASE_URL));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: EventTypeData[] = await res.json();
      setEventTypes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось загрузить типы событий",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventTypes();
  }, [fetchEventTypes]);

  const createEventType = async (data: CreateEventTypeData) => {
    const res = await fetch(new URL("/api/event-types", API_BASE_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const created: EventTypeData = await res.json();
    setEventTypes((prev) => [...prev, created]);
    return created;
  };

  const updateEventType = async (id: string, data: UpdateEventTypeData) => {
    const res = await fetch(
      new URL(`/api/event-types/${id}`, API_BASE_URL),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated: EventTypeData = await res.json();
    setEventTypes((prev) => prev.map((et) => (et.id === id ? updated : et)));
    return updated;
  };

  const toggleActive = async (id: string) => {
    const res = await fetch(
      new URL(`/api/event-types/${id}/toggle-active`, API_BASE_URL),
      { method: "PATCH" },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const toggled: EventTypeData = await res.json();
    setEventTypes((prev) => prev.map((et) => (et.id === id ? toggled : et)));
    return toggled;
  };

  const deleteEventType = async (id: string) => {
    const res = await fetch(
      new URL(`/api/event-types/${id}`, API_BASE_URL),
      { method: "DELETE" },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setEventTypes((prev) => prev.filter((et) => et.id !== id));
  };

  return {
    eventTypes,
    isLoading,
    error,
    refetch: fetchEventTypes,
    createEventType,
    updateEventType,
    toggleActive,
    deleteEventType,
  };
};
