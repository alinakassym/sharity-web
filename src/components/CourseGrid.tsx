// sharity-web/src/components/CourseGrid.tsx

import { useState, useEffect } from "react";
import type { FC } from "react";
import CourseCard, { type CourseData } from "@/components/CourseCard";

type Props = {
  courses: CourseData[];
  gap?: number;
  minWidth?: number; // минимальная ширина карточки для авто-сетки
};

export const CourseGrid: FC<Props> = ({ courses, gap = 16 }) => {
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Синхронизация с исходными данными: если у курса isFavorite === true, отмечаем его
    const initialLiked = new Set<string>();
    courses.forEach((c) => {
      if (c.isFavorite) initialLiked.add(c.id);
    });
    setLiked(initialLiked);
  }, [courses]);

  const toggleLike = async (id: string) => {
    // Оптимистично обновляем UI
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      style={{
        paddingBottom: 32,
        display: "grid",
        gridTemplateColumns: "1fr",
        gap,
      }}
    >
      {courses.map((p) => (
        <div key={p.id}>
          <CourseCard
            course={p}
            isLiked={liked.has(p.id)}
            onHeartPress={toggleLike}
          />
        </div>
      ))}
    </div>
  );
};

export default CourseGrid;
