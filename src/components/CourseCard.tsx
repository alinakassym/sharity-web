import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../theme/colors";
import HeartIcon from "./icons/HeartIcon";

export type CourseData = {
  id: string;
  image: string;
  category: string;
  title: string;
  isFavorite?: boolean;
};

type Props = {
  course: CourseData;
  isLiked?: boolean;
  showHeartBtn?: boolean;
  onHeartPress?: (courseId: string) => void;
};

export const CourseCard: FC<Props> = ({
  course,
  isLiked = false,
  showHeartBtn = true,
  onHeartPress,
}) => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const handleCardClick = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <div
      style={{ background: "transparent", cursor: "pointer" }}
      onClick={handleCardClick}
    >
      {/* изображение + сердце */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <img
          src={course.image}
          alt={course.title}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            display: "block",
          }}
        />
        {showHeartBtn && (
          <button
            type="button"
            aria-label={isLiked ? "Убрать из избранного" : "В избранное"}
            onClick={(e) => {
              e.stopPropagation();
              onHeartPress?.(course.id);
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: 0,
              minWidth: 32,
              maxWidth: 32,
              height: 32,
              borderRadius: 16,
              background: "rgba(255,255,255,0.9)",
              border: "none",
              display: "flex",
              placeItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              outline: "none",
            }}
          >
            <HeartIcon isLiked={isLiked} />
          </button>
        )}
      </div>

      {/* текст */}
      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ fontSize: 12, color: colors.lightText }}>
          {course.category}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
          {course.title}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
