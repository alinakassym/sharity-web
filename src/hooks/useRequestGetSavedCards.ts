// sharity-web/src/hooks/useRequestGetSavedCards.ts

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SavedCard } from "@/types/cards";

export const useRequestGetSavedCards = (userId?: string) => {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const cardsRef = collection(db, "savedCards");
    const q = query(
      cardsRef,
      where("userId", "==", userId),
      where("isDeleted", "==", false)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cardsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SavedCard[];

        // Сортируем на клиенте по дате создания (новые сначала)
        cardsData.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return dateB - dateA;
        });

        setCards(cardsData);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching cards:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { cards, isLoading, error };
};
