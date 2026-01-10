// sharity-web/src/components/CourseCard.tsx

import { type FC } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

export type CourseData = {
  id: string;
  image: string;
  category: string;
  title: string;
  isFavorite?: boolean;
};

type Props = {
  course: CourseData;
  isLiked: boolean;
  onHeartPress: (id: string) => void;
};

const CourseCard: FC<Props> = ({ course, isLiked, onHeartPress }) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  const chipStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: c.text,
    backgroundColor: c.background,
    padding: "6px 10px",
    borderRadius: 999,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  const actionStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: c.text,
    backgroundColor: c.background,
    padding: "10px 12px",
    borderRadius: 12,
    lineHeight: 1,
    textAlign: "center",
    userSelect: "none",
    flex: 1,
  };

  return (
    <Link
      to={`/course/${course.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: 12,
          borderRadius: 16,
          backgroundColor: c.surfaceColor,
          position: "relative",
        }}
      >
        {/* Image */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 14,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <img
            src={course.image}
            alt={course.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Top text */}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                color: c.lightText,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {course.category}
            </div>

            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1.3,
                color: c.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {course.title}
            </div>
          </div>

          {/* Chips row (визуально как в примере) */}
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 2,
            }}
          >
            <div style={chipStyle}>Возраст —</div>
            <div style={chipStyle}>Пробное —</div>
            <div style={chipStyle}>Цена —</div>
          </div>

          {/* Meta (вторая строка мелкого текста) */}
          <div
            style={{
              fontSize: 12,
              color: c.lightText,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span>Адрес: —</span>
          </div>

          {/* Actions row (только внешний вид, без логики) */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 2,
            }}
          >
            <div style={actionStyle}>WhatsApp</div>
            <div style={actionStyle}>Позвонить</div>
          </div>
        </div>

        {/* Heart (логика без изменений) */}
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onHeartPress(course.id);
          }}
          size="small"
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
          }}
        >
          {isLiked ? (
            <FavoriteIcon sx={{ color: "#E53935", fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: c.lightText, fontSize: 20 }} />
          )}
        </IconButton>
      </div>
    </Link>
  );
};

export default CourseCard;
