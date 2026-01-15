// src/hooks/useRequestSetDefaultCard.ts

import { useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useRequestSetDefaultCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setDefaultCard = async (userId: string, cardDocId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Сбросить флаг isDefault у всех карт пользователя
      const cardsRef = collection(db, "savedCards");
      const q = query(cardsRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      const updatePromises = snapshot.docs.map((docSnap) => {
        if (docSnap.id === cardDocId) {
          // Устанавливаем флаг для выбранной карты
          return updateDoc(doc(db, "savedCards", docSnap.id), {
            isDefault: true,
            updatedAt: new Date(),
          });
        } else {
          // Сбрасываем флаг для остальных
          return updateDoc(doc(db, "savedCards", docSnap.id), {
            isDefault: false,
            updatedAt: new Date(),
          });
        }
      });

      await Promise.all(updatePromises);

      setIsLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ошибка при установке карты по умолчанию";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return { setDefaultCard, isLoading, error };
};
