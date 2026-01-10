// sharity-web/src/hooks/useRequestUpdateProduct.ts

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UpdateProductData {
  isFavorite?: boolean;
  isDeleted?: boolean; // Флаг удаления продукта
  status?: "available" | "sold" | "reserved" | "draft"; // Статус товара
  // Можно добавить другие поля для обновления в будущем
  name?: string;
  category?: string;
  price?: number;
  description?: string;
  condition?: string;
}

export const useRequestUpdateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProduct = async (
    productId: string,
    updateData: UpdateProductData,
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // Добавляем timestamp обновления
      const dataToUpdate = {
        ...updateData,
        updatedAt: new Date(),
      };

      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, dataToUpdate);

      setSuccess(true);
      setIsLoading(false);

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при обновлении товара";
      setError(errorMessage);
      setIsLoading(false);

      return { success: false, error: errorMessage };
    }
  };

  const toggleFavorite = async (
    productId: string,
    currentFavoriteState: boolean,
  ) => {
    return updateProduct(productId, { isFavorite: !currentFavoriteState });
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    updateProduct,
    toggleFavorite,
    isLoading,
    error,
    success,
    resetState,
  };
};
