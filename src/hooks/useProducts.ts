// sharity-web/src/hooks/useProducts.ts

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

export interface ProductFromAPI {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId?: string;
  sizeId?: string;
  category: string;
  subcategory?: string;
  productSize?: string;
  price: number;
  description?: string;
  condition?: string;
  saleType: "group" | "individual";
  quantity?: number;
  contactName: string;
  contactPhone: string;
  imagesArray?: string[];
  status: "available" | "sold" | "reserved" | "draft";
  isFavorite?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<ProductFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(new URL("/api/products", API_BASE_URL));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ProductFromAPI[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось загрузить товары",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
};
