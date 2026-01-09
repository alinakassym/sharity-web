// sharity-web/src/hooks/useRequestDeleteCard.ts

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useRequestDeleteCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCard = async (cardDocId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const cardRef = doc(db, "savedCards", cardDocId);

      // Софт-удаление
      await updateDoc(cardRef, {
        isDeleted: true,
        updatedAt: new Date(),
      });

      setIsLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ошибка при удалении карты";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return { deleteCard, isLoading, error };
};
