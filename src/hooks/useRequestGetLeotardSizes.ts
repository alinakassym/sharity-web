import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface LeotardSizeData {
  id: string;
  height: string; // Например "104-110"
  size: number; // Например 28
}

export const useRequestGetLeotardSizes = () => {
  const [sizes, setSizes] = useState<LeotardSizeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const sizesRef = collection(db, "leotardSizes");
        const querySnapshot = await getDocs(sizesRef);

        const sizesData: LeotardSizeData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          sizesData.push({
            id: doc.id,
            height: data.height || "",
            size: data.size || 0,
          });
        });

        // Сортируем по размеру (size)
        sizesData.sort((a, b) => a.size - b.size);

        setSizes(sizesData);
      } catch (err) {
        console.error("Ошибка при загрузке размеров купальников:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить размеры купальников",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSizes();
  }, []);

  return { sizes, isLoading, error };
};
