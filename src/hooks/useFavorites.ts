// src/hooks/useFavorites.ts

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getTelegramUser } from "@/lib/telegram";

export type FavoriteType = "course" | "product";

/**
 * Хук для управления избранным пользователя
 * Использует Firestore subcollection: users/{userId}/favorites/{itemId}
 */
export const useFavorites = (type: FavoriteType) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Получаем ID пользователя из Telegram
  const { user } = getTelegramUser();
  const userId = user?.id?.toString();

  useEffect(() => {
    // Если нет userId, возвращаем пустой список
    if (!userId) {
      setIsLoading(false);
      setFavorites(new Set());
      return;
    }

    // Подписываемся на изменения в коллекции favorites пользователя
    const favoritesRef = collection(db, "users", userId, "favorites");

    const unsubscribe = onSnapshot(
      favoritesRef,
      (snapshot) => {
        const favoriteIds = new Set<string>();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          // Фильтруем только по типу (course или product)
          if (data.type === type) {
            favoriteIds.add(doc.id);
          }
        });

        setFavorites(favoriteIds);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching favorites:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId, type]);

  /**
   * Проверяет, находится ли элемент в избранном
   */
  const isFavorite = useCallback(
    (itemId: string): boolean => {
      return favorites.has(itemId);
    },
    [favorites],
  );

  /**
   * Добавляет или удаляет элемент из избранного
   */
  const toggleFavorite = useCallback(
    async (itemId: string) => {
      if (!userId) {
        console.warn("Cannot toggle favorite: user not authenticated");
        return;
      }

      const favoriteRef = doc(db, "users", userId, "favorites", itemId);

      try {
        if (favorites.has(itemId)) {
          // Удаляем из избранного
          await deleteDoc(favoriteRef);
        } else {
          // Добавляем в избранное
          await setDoc(favoriteRef, {
            type,
            createdAt: new Date(),
          });
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },
    [userId, favorites, type],
  );

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
  };
};
