// src/hooks/useFavorites.ts

import { useEffect, useState, useCallback } from "react";
import { getTelegramUser } from "@/lib/telegram";

export type FavoriteType = "course" | "product";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

/**
 * Хук для управления избранным пользователя через MongoDB API
 */
export const useFavorites = (type: FavoriteType) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const { user } = getTelegramUser();
  const telegramId = user?.id;

  const fetchFavorites = useCallback(async () => {
    if (!telegramId) {
      setIsLoading(false);
      setFavorites(new Set());
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        new URL(
          `/api/favorites?telegramId=${telegramId}&type=${type}`,
          API_BASE_URL,
        ),
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const itemIds: string[] = await res.json();
      setFavorites(new Set(itemIds));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [telegramId, type]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback(
    (itemId: string): boolean => {
      return favorites.has(itemId);
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (itemId: string) => {
      if (!telegramId) {
        console.warn("Cannot toggle favorite: user not authenticated");
        return;
      }

      try {
        if (favorites.has(itemId)) {
          // Optimistic update: убираем сразу
          setFavorites((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
          await fetch(
            new URL(
              `/api/favorites/${itemId}?telegramId=${telegramId}`,
              API_BASE_URL,
            ),
            { method: "DELETE" },
          );
        } else {
          // Optimistic update: добавляем сразу
          setFavorites((prev) => new Set(prev).add(itemId));
          await fetch(new URL("/api/favorites", API_BASE_URL), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telegramId, itemId, type }),
          });
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        // При ошибке перезапрашиваем актуальное состояние
        fetchFavorites();
      }
    },
    [telegramId, favorites, type, fetchFavorites],
  );

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
  };
};
