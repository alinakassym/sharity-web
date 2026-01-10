// sharity-web/src/hooks/useRequestCreateProduct.ts

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CreateProductData {
  name: string;
  category: string;
  subcategory?: string; // Подкатегория гимнастики (если выбрана)
  size?: number; // Размер купальника (если выбран)
  price: number;
  description?: string;
  condition?: string;
  status?: "available" | "sold" | "reserved" | "draft"; // Статус товара
  isFavorite?: boolean;
  isDeleted?: boolean; // Флаг удаления продукта
  imagesArray?: string[];
  createdBy?: string; // Telegram username пользователя
  createdAt?: Date;
}

export const useRequestCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createProduct = async (productData: CreateProductData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // Добавляем timestamp создания и устанавливаем статус "available" по умолчанию
      const dataToSave = {
        ...productData,
        status: productData.status || "available", // По умолчанию товар доступен
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Удаляем поля со значением undefined (Firestore не принимает undefined)
      Object.keys(dataToSave).forEach((key) => {
        if (dataToSave[key as keyof typeof dataToSave] === undefined) {
          delete dataToSave[key as keyof typeof dataToSave];
        }
      });

      const col = collection(db, "products");
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
    createProduct,
    isLoading,
    error,
    success,
    resetState,
  };
};
