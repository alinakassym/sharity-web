import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CourseFromDB {
  id: string;
  name?: string;
  category?: string;
  price?: number;
  description?: string;
  image?: string;
  imagesArray?: string[];
  isFavorite?: boolean;
  isDeleted?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  locations?: Array<{
    location: string;
    locationCoordinates: [number, number];
  }>;

  // ➕ НОВЫЕ поля
  coverImage?: string;
  ageFrom?: number;
  ageTo?: number;
  priceFrom?: number;
  priceText?: string;
  scheduleText?: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
}

export const useRequestGetCourse = (courseId: string | undefined) => {
  const [course, setCourse] = useState<CourseFromDB | null>(null);
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
          const courseData = { id: docSnap.id, ...docSnap.data() } as CourseFromDB;
          // Проверяем, не удален ли курс
          if (courseData.isDeleted) {
            setCourse(null);
            setError("Курс удален");
          } else {
            setCourse(courseData);
          }
        } else {
          setCourse(null);
          setError("Курс не найден");
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || "Ошибка при загрузке курса");
        setIsLoading(false);
      },
    );

    return unsub;
  }, [courseId]);

  return { course, isLoading, error };
};
