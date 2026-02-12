// sharity-web/src/hooks/useSubcategories.ts

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = (import.meta.env.VITE_APP_BASE_URL as string).replace(
  /\/+$/,
  "",
);

export interface SubcategoryData {
  id: string;
  categoryId: string;
  name_ru: string;
  name_en: string;
  is_active: boolean;
  saleType?: "group" | "individual" | "all";
  order?: number;
}

export type CreateSubcategoryData = Omit<SubcategoryData, "id" | "categoryId">;
export type UpdateSubcategoryData = Partial<CreateSubcategoryData>;

export const useSubcategories = (categoryId: string | null) => {
  const [subcategories, setSubcategories] = useState<SubcategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubcategories = useCallback(async () => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(
        new URL(`/api/categories/${categoryId}/subcategories`, API_BASE_URL),
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SubcategoryData[] = await res.json();
      setSubcategories(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось загрузить подкатегории",
      );
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  const createSubcategory = async (data: CreateSubcategoryData) => {
    if (!categoryId) return;
    const res = await fetch(
      new URL(`/api/categories/${categoryId}/subcategories`, API_BASE_URL),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const created: SubcategoryData = await res.json();
    setSubcategories((prev) => [...prev, created]);
    return created;
  };

  const updateSubcategory = async (
    id: string,
    data: UpdateSubcategoryData,
  ) => {
    if (!categoryId) return;
    const res = await fetch(
      new URL(
        `/api/categories/${categoryId}/subcategories/${id}`,
        API_BASE_URL,
      ),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated: SubcategoryData = await res.json();
    setSubcategories((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const toggleActive = async (id: string) => {
    if (!categoryId) return;
    const res = await fetch(
      new URL(
        `/api/categories/${categoryId}/subcategories/${id}/toggle-active`,
        API_BASE_URL,
      ),
      { method: "PATCH" },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const toggled: SubcategoryData = await res.json();
    setSubcategories((prev) => prev.map((s) => (s.id === id ? toggled : s)));
    return toggled;
  };

  const deleteSubcategory = async (id: string) => {
    if (!categoryId) return;
    const res = await fetch(
      new URL(
        `/api/categories/${categoryId}/subcategories/${id}`,
        API_BASE_URL,
      ),
      { method: "DELETE" },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setSubcategories((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    subcategories,
    isLoading,
    error,
    refetch: fetchSubcategories,
    createSubcategory,
    updateSubcategory,
    toggleActive,
    deleteSubcategory,
  };
};
