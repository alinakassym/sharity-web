// sharity-web/src/hooks/useCreateProduct.ts

import { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

export interface CreateProductPayload {
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
  createdBy?: string;
}

export const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: CreateProductPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(new URL("/api/products", API_BASE_URL), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const created = await res.json();
      return { success: true as const, id: created.id as string };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при создании товара";
      setError(errorMessage);
      return { success: false as const, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { createProduct, isLoading, error };
};
