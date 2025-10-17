import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot /* getDocs, query, orderBy */,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useRequestGetProducts = () => {
  const [products, setProducts] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Array<{ id: string; [k: string]: any }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, "products"); // Firestore collection
    const unsub = onSnapshot(
      col,
      (snap) => {
        const arr = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((product) => !product.isDeleted); // Фильтрация удаленных продуктов
        setProducts(arr);
        setIsLoading(false);
      },
      () => setIsLoading(false),
    );
    return unsub;
  }, []);

  return { products, isLoading };
};
