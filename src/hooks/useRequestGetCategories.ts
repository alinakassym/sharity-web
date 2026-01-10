// sharity-web/src/hooks/useRequestGetCategories.ts

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CategoryData {
  id: string;
  name_en: string;
  name_ru: string;
  icon?: string;
  is_active: boolean;
  order?: number;
}

export const useRequestGetCategories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const categoriesRef = collection(db, "categories");
        // Получаем только активные категории
        const q = query(categoriesRef, where("is_active", "==", true));
        const querySnapshot = await getDocs(q);

        const categoriesData: CategoryData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          categoriesData.push({
            id: doc.id,
            name_en: data.name_en || "",
            name_ru: data.name_ru || "",
            icon: data.icon,
            is_active: data.is_active ?? true,
            order: data.order,
          });
        });

        // Сортируем по полю order (если есть), затем по русскому названию
        categoriesData.sort((a, b) => {
          // Если у обоих есть order, сортируем по нему
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          // Если order есть только у одного, он идёт первым
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          // Если order нет ни у одного, сортируем по названию
          return a.name_ru.localeCompare(b.name_ru, "ru");
        });

        setCategories(categoriesData);
      } catch (err) {
        console.error("Ошибка при загрузке категорий:", err);
        setError(
          err instanceof Error ? err.message : "Не удалось загрузить категории",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};
