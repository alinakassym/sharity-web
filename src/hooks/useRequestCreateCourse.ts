// src/hooks/useRequestCreateCourse.ts

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CreateCourseData {
  name: string;
  category: string;
  description?: string;
  isFavorite?: boolean;
  isDeleted?: boolean; // Флаг удаления курса
  imagesArray?: string[];
  createdBy?: string; // Telegram username пользователя
  createdAt?: Date;
  locations?: Array<{
    location: string;
    locationCoordinates: [number, number];
  }>; // Массив локаций

  // ➕ НОВЫЕ поля
  coverImage?: string; // Главное изображение из imagesArray
  ageFrom?: number; // Возраст от (лет)
  ageTo?: number; // Возраст до (лет)
  priceFrom?: number; // Цена от (₸)
  priceText?: string; // Текстовое описание цены
  scheduleText?: string; // Расписание
  phone?: string; // Основной телефон
  whatsapp?: string; // WhatsApp номер
  telegram?: string; // Telegram username
}

export const useRequestCreateCourse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createCourse = async (courseData: CreateCourseData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // Добавляем timestamp создания
      const dataToSave = {
        ...courseData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Удаляем поля со значением undefined (Firestore не принимает undefined)
      Object.keys(dataToSave).forEach((key) => {
        if (dataToSave[key as keyof typeof dataToSave] === undefined) {
          delete dataToSave[key as keyof typeof dataToSave];
        }
      });

      const col = collection(db, "courses");
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
    createCourse,
    isLoading,
    error,
    success,
    resetState,
  };
};
