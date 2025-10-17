import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
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
  image?: string;
  imagesArray?: string[];
  isFavorite?: boolean;
  isDeleted?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useRequestGetProduct = (productId: string | undefined) => {
  const [product, setProduct] = useState<ProductFromDB | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setIsLoading(false);
      setError("ID продукта не найден");
      return;
    }

    setIsLoading(true);
    setError(null);

    const productRef = doc(db, "products", productId);
    const unsub = onSnapshot(
      productRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const productData = {
            id: docSnap.id,
            ...docSnap.data(),
          } as ProductFromDB;
          // Проверяем, не удален ли продукт
          if (productData.isDeleted) {
            setProduct(null);
            setError("Товар удален");
          } else {
            setProduct(productData);
          }
        } else {
          setProduct(null);
          setError("Товар не найден");
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || "Ошибка при загрузке продукта");
        setIsLoading(false);
      },
    );

    return unsub;
  }, [productId]);

  return { product, isLoading, error };
};