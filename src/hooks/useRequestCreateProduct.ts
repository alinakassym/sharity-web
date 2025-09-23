import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CreateProductData {
  name: string;
  category: string;
  price: number;
  description?: string;
  condition?: string;
  isFavorite?: boolean;
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

      // Добавляем timestamp создания
      const dataToSave = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

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
