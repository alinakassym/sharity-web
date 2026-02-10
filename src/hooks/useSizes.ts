// sharity-web/src/hooks/useSizes.ts

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

export interface SizeData {
  id: string;
  subcategoryId: string;
  manufacturer_size: string;
  size_ua_ru?: string;
  size_eu?: string;
  height_from?: number;
  height_to?: number;
  length?: number;
  diameter?: number;
  foot_size?: string;
  circumference?: string;
  is_active: boolean;
  order?: number;
}

export type CreateSizeData = Omit<SizeData, "id" | "subcategoryId">;
export type UpdateSizeData = Partial<CreateSizeData>;

export const useSizes = (
  categoryId: string | null,
  subcategoryId: string | null,
) => {
  const [sizes, setSizes] = useState<SizeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSizes = useCallback(async () => {
    if (!categoryId || !subcategoryId) {
      setSizes([]);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(
        new URL(
          `/api/categories/${categoryId}/subcategories/${subcategoryId}/sizes`,
          API_BASE_URL,
        ),
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SizeData[] = await res.json();
      setSizes(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось загрузить размеры",
      );
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

  const createSize = async (data: CreateSizeData) => {
    if (!categoryId || !subcategoryId) return;
    const res = await fetch(
      new URL(
        `/api/categories/${categoryId}/subcategories/${subcategoryId}/sizes`,
        API_BASE_URL,
      ),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const created: SizeData = await res.json();
    setSizes((prev) => [...prev, created]);
    return created;
  };

  const updateSize = async (id: string, data: UpdateSizeData) => {
    if (!categoryId || !subcategoryId) return;
    const res = await fetch(
      new URL(
        `/api/categories/${categoryId}/subcategories/${subcategoryId}/sizes/${id}`,
        API_BASE_URL,
      ),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated: SizeData = await res.json();
    setSizes((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const toggleActive = async (id: string) => {
    if (!categoryId || !subcategoryId) return;
    const res = await fetch(
      new URL(
        `/api/categories/${categoryId}/subcategories/${subcategoryId}/sizes/${id}/toggle-active`,
        API_BASE_URL,
      ),
      { method: "PATCH" },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const toggled: SizeData = await res.json();
    setSizes((prev) => prev.map((s) => (s.id === id ? toggled : s)));
    return toggled;
  };

  const deleteSize = async (id: string) => {
    if (!categoryId || !subcategoryId) return;
    const res = await fetch(
      new URL(
        `/api/categories/${categoryId}/subcategories/${subcategoryId}/sizes/${id}`,
        API_BASE_URL,
      ),
      { method: "DELETE" },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setSizes((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    sizes,
    isLoading,
    error,
    refetch: fetchSizes,
    createSize,
    updateSize,
    toggleActive,
    deleteSize,
  };
};
