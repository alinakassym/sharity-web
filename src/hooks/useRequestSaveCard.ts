// src/hooks/useRequestSaveCard.ts

import { useState } from "react";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useRequestSaveCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveCard = async (
    userId: string,
    cardId: string,
    cardMask: string,
    cardType: string,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Проверяем, является ли это первой картой пользователя
      const cardsRef = collection(db, "savedCards");
      const existingCardsQuery = query(
        cardsRef,
        where("userId", "==", userId),
        where("isDeleted", "==", false),
      );
      const snapshot = await getDocs(existingCardsQuery);
      const isFirstCard = snapshot.empty;

      // Составной document ID для уникальности
      const docId = `${userId}_${cardId}`;
      const cardRef = doc(db, "savedCards", docId);

      const cardData = {
        userId,
        cardId,
        cardMask,
        cardType,
        isDefault: isFirstCard, // Первая карта автоматически становится default
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      await setDoc(cardRef, cardData);

      setIsLoading(false);
      return { success: true, cardId: docId };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при сохранении карты";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return { saveCard, isLoading, error };
};
