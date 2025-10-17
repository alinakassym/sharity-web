import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot /* getDocs, query, orderBy */,
} from "firebase/firestore";
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
}

export const useRequestGetCourses = () => {
  const [courses, setCourses] = useState<CourseFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, "courses"); // Firestore collection
    const unsub = onSnapshot(
      col,
      (snap) => {
        const arr = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as CourseFromDB))
          .filter((course) => !course.isDeleted); // Фильтрация удаленных курсов
        setCourses(arr);
        setIsLoading(false);
      },
      () => setIsLoading(false),
    );
    return unsub;
  }, []);

  return { courses, isLoading };
};
