import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CreateEventData {
  name: string;
  category: string;
  date: Date;
  time: string;
  url?: string;
  description?: string;
  isFavorite?: boolean;
  location: string;
  locationCoordinates?: [number, number];
  imagesArray?: string[];
  createdBy?: string; // Telegram username пользователя
  createdAt?: Date;
}

export const useRequestCreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createEvent = async (eventData: CreateEventData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // Добавляем timestamp создания
      const dataToSave = {
        ...eventData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const col = collection(db, "events");
      const docRef = await addDoc(col, dataToSave);

      setSuccess(true);
      setIsLoading(false);

      return { success: true, id: docRef.id };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при создании товара";
      setError(errorMessage);
      setIsLoading(false);

      return { success: false, error: errorMessage };
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    createEvent,
    isLoading,
    error,
    success,
    resetState,
  };
};
