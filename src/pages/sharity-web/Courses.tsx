// sharity-web/src/pages/sharity-web/Courses.tsx

import type { FC } from "react";
import { useState, useMemo } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import SearchHeader from "@/components/SearchHeader";
import CategoryFilter, { type Category } from "@/components/CategoryFilter";
import CourseGrid from "@/components/CourseGrid";
import { type CourseData } from "@/components/CourseCard";
import { useRequestGetCourses } from "@/hooks/useRequestGetCourses";
import { useRequestGetCategories } from "@/hooks/useRequestGetCategories";

const Courses: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  const [selected, setSelected] = useState<string[]>([]); // пусто = все категории
  const [searchValue, setSearchValue] = useState("");

  const { courses: rows, isLoading: isLoadingCourses } = useRequestGetCourses();
  const { categories: categoriesFromFirebase, isLoading: isLoadingCategories } =
    useRequestGetCategories();

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
          isFavorite: r.isFavorite ?? false,
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
      const byCat = selectedLabels.size === 0 || selectedLabels.has(p.category);
      const byQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return byCat && byQuery;
    });
  }, [courses, selectedLabels, searchValue]);

  return (
    <section
      style={{
        paddingTop: isTelegram ? 112 : 64,
        minHeight: "100vh",
        paddingBottom: "74px",
        backgroundColor: c.background,
      }}
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
          <div style={{ padding: 16 }}>Загрузка категорий…</div>
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
          <div style={{ padding: 16 }}>Загрузка курсов…</div>
        ) : (
          <CourseGrid courses={filtered} />
        )}
      </div>
    </section>
  );
};

export default Courses;
