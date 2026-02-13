// src/pages/Courses.tsx

import type { FC } from "react";
import { useState, useMemo } from "react";
import { Colors } from "@/theme/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import { useRequestGetCourses } from "@/hooks/useRequestGetCourses";
import { useRequestGetCategories } from "@/hooks/useRequestGetCategories";
import { useFavorites } from "@/hooks/useFavorites";
import SearchHeader from "@/components/SearchHeader";
import CategoryFilter, { type Category } from "@/components/CategoryFilter";
import CategoryFilterSkeleton from "@/components/CategoryFilterSkeleton";
import CourseGrid from "@/components/CourseGrid";
import CourseCardSkeleton from "@/components/CourseCardSkeleton";
import { type CourseData } from "@/components/CourseCard";
import Container from "@/components/Container";

const Courses: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  const paddingTop = useSafePaddingTop(48, 0);
  const platformName = useSafePlatform();

  const [selected, setSelected] = useState<string[]>([]); // пусто = все категории
  const [searchValue, setSearchValue] = useState("");

  const { courses: rows, isLoading: isLoadingCourses } = useRequestGetCourses();
  const { categories: categoriesFromFirebase, isLoading: isLoadingCategories } =
    useRequestGetCategories();

  // Получаем список избранных курсов текущего пользователя
  const { favorites: favoriteCourseIds } = useFavorites("course");

  // Преобразуем категории из Firebase в формат Category для CategoryFilter
  const categories: Category[] = useMemo(() => {
    return categoriesFromFirebase.map((cat) => ({
      id: cat.name_ru, // Используем русское название как ID для фильтрации
      label: cat.name_ru,
      icon: cat.icon || "category", // Fallback иконка если не указана
    }));
  }, [categoriesFromFirebase]);

  // Firestore - CourseData (для грида)
  const courses: CourseData[] = useMemo(
    () =>
      rows.map((r, i) => {
        // ➕ Приоритет отображения изображений:
        // 1. coverImage (главное изображение)
        // 2. Первое изображение из imagesArray
        // 3. Поле image (для совместимости)
        // 4. Fallback заглушка
        let imageUrl = `https://picsum.photos/600?${i + 1}`;

        if (r.coverImage) {
          imageUrl = r.coverImage;
        } else if (r.imagesArray && r.imagesArray.length > 0) {
          imageUrl = r.imagesArray[0];
        } else if (r.image) {
          imageUrl = r.image;
        }

        return {
          id: r.id,
          image: imageUrl,
          category: r.category ?? "",
          title: r.name ?? "",
          shortDescription: r.shortDescription ?? "",
          ageFrom: r.ageFrom,
          ageTo: r.ageTo,
          priceFrom: r.priceFrom,
          priceText: r.priceText,
          location:
            r.locations && r.locations.length > 0
              ? r.locations[0].location
              : undefined,
          phone: r.phone,
          whatsapp: r.whatsapp,
          telegram: r.telegram,
        };
      }),
    [rows],
  );

  // выбранные ярлыки категорий
  const selectedLabels = useMemo(() => {
    return new Set(selected);
  }, [selected]);

  // фильтрация по категориям и поиску
  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return courses.filter((p) => {
      // Проверяем, выбрана ли категория "Избранное"
      const isFavoritesSelected = selectedLabels.has("Избранное");

      // Фильтрация по категориям
      let byCat = true;
      if (selectedLabels.size > 0) {
        if (isFavoritesSelected) {
          // Если выбрано "Избранное" - показываем только избранные курсы пользователя
          byCat = favoriteCourseIds.has(p.id);
        } else {
          // Иначе фильтруем по обычным категориям
          byCat = selectedLabels.has(p.category);
        }
      }

      // Фильтрация по поиску
      const byQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return byCat && byQuery;
    });
  }, [courses, selectedLabels, searchValue, favoriteCourseIds]);

  return (
    <Container
      paddingTop={
        platformName === "desktop"
          ? 64
          : platformName === "unknown"
            ? 64
            : paddingTop + 64
      }
    >
      <SearchHeader searchValue={searchValue} onSearchChange={setSearchValue} />

      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          backgroundColor: c.background,
        }}
      >
        {isLoadingCategories ? (
          <CategoryFilterSkeleton />
        ) : (
          <CategoryFilter
            categories={categories}
            selectedIds={selected}
            onChange={setSelected}
            multi={true}
            onOpenFilter={() => console.log("open filter modal")}
          />
        )}

        {isLoadingCourses ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 12,
            }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <CourseGrid courses={filtered} />
        )}
      </div>
    </Container>
  );
};

export default Courses;
