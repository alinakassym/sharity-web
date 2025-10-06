import type { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import ProductHeader from "@/components/ProductHeader";
import { useRequestGetCourse } from "@/hooks/useRequestGetCourse";

const Course: FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const { course: courseData, isLoading, error } = useRequestGetCourse(id);

  const handleBackClick = () => {
    navigate(-1);
  };

  // Генерируем стабильный индекс для fallback картинки на основе ID
  const getImageIndex = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 1000) + 1;
  };

  const course = courseData
    ? {
        id: courseData.id,
        image:
          // Приоритет отображения изображений:
          // 1. Первое изображение из imagesArray
          // 2. Параметр image из URL
          // 3. Поле image (для совместимости)
          // 4. Fallback заглушка
          courseData.imagesArray && courseData.imagesArray.length > 0
            ? courseData.imagesArray[0]
            : courseData.image ||
              `https://picsum.photos/600?${getImageIndex(courseData.id)}`,
        category: courseData.category || "",
        title: courseData.name || "",
        description: courseData.description || "",
        imagesArray: courseData.imagesArray || [],
      }
    : null;

  if (isLoading) {
    return (
      <section
        style={{
          position: "fixed",
          left: 0,
          right: 0,
        }}
      >
        <ProductHeader onGoBack={handleBackClick} />
        <div style={{ padding: 16 }}>Загрузка…</div>
      </section>
    );
  }

  if (error || !course) {
    return (
      <section
        style={{
          position: "fixed",
          left: 0,
          right: 0,
        }}
      >
        <ProductHeader onGoBack={handleBackClick} />
        <div style={{ padding: 16, color: colors.lightText }}>
          {error || "Не найдено"}
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        position: "fixed",
        left: 0,
        right: 0,
      }}
    >
      {/* Header с кнопкой назад */}
      <ProductHeader onGoBack={handleBackClick} />

      {/* Контент продукта */}
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          height: "calc(100vh - 90px)",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Изображение */}
        <div style={{}}>
          <img
            src={course.image}
            alt={course.title}
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "cover",
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
            }}
          />
        </div>

        {/* Информация о товаре */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 14,
              color: colors.lightText,
            }}
          >
            {course.category}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: colors.text,
            }}
          >
            {course.title}
          </h2>

          <div
            style={{
              fontSize: 16,
              lineHeight: "1.5",
              color: colors.text,
              marginTop: 16,
            }}
          >
            {course.description}
          </div>
        </div>

        {/* Кнопки действий */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
            paddingBottom: 48,
          }}
        ></div>
      </div>
    </section>
  );
};

export default Course;
