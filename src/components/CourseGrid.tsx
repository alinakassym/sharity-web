// sharity-web/src/components/CourseGrid.tsx

import type { FC } from "react";
import CourseCard, { type CourseData } from "@/components/CourseCard";
import { useFavorites } from "@/hooks/useFavorites";

type Props = {
  courses: CourseData[];
  gap?: number;
  minWidth?: number; // минимальная ширина карточки для авто-сетки
};

export const CourseGrid: FC<Props> = ({ courses, gap = 16 }) => {
  // Используем новый хук для управления избранным
  const { isFavorite, toggleFavorite } = useFavorites("course");

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
            isLiked={isFavorite(p.id)}
            onHeartPress={toggleFavorite}
          />
        </div>
      ))}
    </div>
  );
};

export default CourseGrid;
