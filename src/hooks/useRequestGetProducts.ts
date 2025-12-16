import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot /* getDocs, query, orderBy */,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProductFromDB {
  id: string;
  name?: string;
  category?: string;
  subcategory?: string;
  productSize?: number;
  price?: number;
  description?: string;
  condition?: string;
  status?: "available" | "sold" | "reserved" | "draft"; // Статус товара
  image?: string;
  imagesArray?: string[];
  isFavorite?: boolean;
  isDeleted?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useRequestGetProducts = () => {
  const [products, setProducts] = useState<ProductFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, "products"); // Firestore collection
    const unsub = onSnapshot(
      col,
      (snap) => {
        const arr = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as ProductFromDB))
          .filter(
            (product) =>
              !product.isDeleted && // Фильтрация удаленных продуктов
              (product.status === "available" || !product.status), // Показываем только доступные (или без статуса для старых товаров)
          );
        setProducts(arr);
        setIsLoading(false);
      },
      () => setIsLoading(false),
    );
    return unsub;
  }, []);

  return { products, isLoading };
};
