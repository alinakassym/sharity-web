// sharity-web/src/hooks/useProduct.ts

import { useState, useEffect, useCallback } from "react";
import type { ProductFromAPI } from "./useProducts";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<ProductFromAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      setIsLoading(false);
      setError("ID продукта не найден");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(new URL(`/api/products/${id}`, API_BASE_URL));
      if (res.status === 404) {
        setProduct(null);
        setError("Товар не найден");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ProductFromAPI = await res.json();
      setProduct(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось загрузить товар",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, isLoading, error, refetch: fetchProduct };
};
