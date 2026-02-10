// sharity-web/src/hooks/useCategories.ts

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

export interface CategoryData {
  id: string;
  name_ru: string;
  name_en: string;
  icon?: string;
  is_active: boolean;
  order?: number;
}

export type CreateCategoryData = Omit<CategoryData, "id">;
export type UpdateCategoryData = Partial<Omit<CategoryData, "id">>;

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(new URL("/api/categories", API_BASE_URL));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CategoryData[] = await res.json();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось загрузить категории",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (data: CreateCategoryData) => {
    const res = await fetch(new URL("/api/categories", API_BASE_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const created: CategoryData = await res.json();
    setCategories((prev) => [...prev, created]);
    return created;
  };

  const updateCategory = async (id: string, data: UpdateCategoryData) => {
    const res = await fetch(new URL(`/api/categories/${id}`, API_BASE_URL), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated: CategoryData = await res.json();
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const toggleActive = async (id: string) => {
    const res = await fetch(
      new URL(`/api/categories/${id}/toggle-active`, API_BASE_URL),
      { method: "PATCH" },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const toggled: CategoryData = await res.json();
    setCategories((prev) => prev.map((c) => (c.id === id ? toggled : c)));
    return toggled;
  };

  const deleteCategory = async (id: string) => {
    const res = await fetch(new URL(`/api/categories/${id}`, API_BASE_URL), {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    toggleActive,
    deleteCategory,
  };
};
