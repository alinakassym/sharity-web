import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useRequestGetCourse = (courseId: string | undefined) => {
  const [course, setCourse] =
    useState<// eslint-disable-next-line @typescript-eslint/no-explicit-any
    { id: string; [k: string]: any } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setCourse(null);
      setIsLoading(false);
      setError("ID продукта не найден");
      return;
    }

    setIsLoading(true);
    setError(null);

    const courseRef = doc(db, "courses", courseId);
    const unsub = onSnapshot(
      courseRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setCourse({ id: docSnap.id, ...docSnap.data() });
        } else {
          setCourse(null);
          setError("Продукт не найден");
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || "Ошибка при загрузке продукта");
        setIsLoading(false);
      },
    );

    return unsub;
  }, [courseId]);

  return { course, isLoading, error };
};
