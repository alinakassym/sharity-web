// src/hooks/useUserProducts.ts

import { useState, useEffect, useCallback } from "react";
import { getTelegramUser } from "@/lib/telegram";
import type { ProductFromAPI } from "./useProducts";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

export const useUserProducts = () => {
  const [products, setProducts] = useState<ProductFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = getTelegramUser();
  const createdBy = user?.username || user?.first_name;

  const fetchProducts = useCallback(async () => {
    if (!createdBy) {
      setError("Данные пользователя Telegram не найдены");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(
        new URL(
          `/api/products?createdBy=${encodeURIComponent(createdBy)}`,
          API_BASE_URL,
        ),
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ProductFromAPI[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось загрузить публикации",
      );
    } finally {
      setIsLoading(false);
    }
  }, [createdBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
};
