import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getTelegramUser } from "@/lib/telegram";

interface ProductFromDB {
  id: string;
  name?: string;
  category?: string;
  subcategory?: string;
  productSize?: number;
  price?: number;
  description?: string;
  condition?: string;
  image?: string;
  imagesArray?: string[];
  isFavorite?: boolean;
  isDeleted?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useRequestGetUserProducts = () => {
  const [products, setProducts] = useState<ProductFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const { user } = getTelegramUser();

      if (!user) {
        setError("Данные пользователя Telegram не найдены");
        setIsLoading(false);
        return;
      }

      // Получаем username или first_name
      const createdBy = user.username || user.first_name;

      if (!createdBy) {
        setError("Не удалось определить пользователя");
        setIsLoading(false);
        return;
      }

      // Создаем query для фильтрации по createdBy
      const col = collection(db, "products");
      const q = query(col, where("createdBy", "==", createdBy));

      const unsub = onSnapshot(
        q,
        (snap) => {
          const arr = snap.docs
            .map((d) => ({ id: d.id, ...d.data() } as ProductFromDB))
            .filter((product) => !product.isDeleted); // Фильтрация удаленных продуктов
          setProducts(arr);
          setIsLoading(false);
        },
        (err) => {
          console.error("Ошибка при загрузке публикаций:", err);
          setError("Не удалось загрузить публикации");
          setIsLoading(false);
        },
      );

      return unsub;
    } catch (err) {
      console.error("Ошибка при инициализации:", err);
      setError("Произошла ошибка");
      setIsLoading(false);
    }
  }, []);

  return { products, isLoading, error };
};
