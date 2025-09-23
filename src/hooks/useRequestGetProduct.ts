import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useRequestGetProduct = (productId: string | undefined) => {
  const [product, setProduct] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { id: string; [k: string]: any } | null
  >(null);
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
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProduct(null);
          setError("Продукт не найден");
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || "Ошибка при загрузке продукта");
        setIsLoading(false);
      }
    );

    return unsub;
  }, [productId]);

  return { product, isLoading, error };
};