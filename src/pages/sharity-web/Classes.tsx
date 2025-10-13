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

const ALL: Category[] = [
  { id: "Гимнастика", label: "Гимнастика", icon: "gymnastics" },
  { id: "Танцы", label: "Танцы", icon: "dance" },
  { id: "Балет", label: "Балет", icon: "ballet" },
  { id: "Волейбол", label: "Волейбол", icon: "volleyball" },
  { id: "Теннис", label: "Теннис", icon: "tennis" },
  { id: "Футбол", label: "Футбол", icon: "football" },
  { id: "Хоккей", label: "Хоккей", icon: "hockey" },
  { id: "Бег", label: "Бег", icon: "run" },
];

const KZT = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

const Classes: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  const [selected, setSelected] = useState<string[]>([]); // пусто = все категории
  const [searchValue, setSearchValue] = useState("");

  const { courses: rows, isLoading } = useRequestGetCourses();

  // Firestore - CourseData (для грида)
  const courses: CourseData[] = useMemo(
    () =>
      rows.map((r, i) => {
        // Приоритет отображения изображений:
        // 1. Первое изображение из imagesArray
        // 2. Поле image (для совместимости)
        // 3. Fallback заглушка
        let imageUrl = `https://picsum.photos/600?${i + 1}`;

        if (r.imagesArray && r.imagesArray.length > 0) {
          imageUrl = r.imagesArray[0];
        } else if (r.image) {
          imageUrl = r.image;
        }

        return {
          id: r.id,
          image: imageUrl,
          category: r.category ?? "",
          title: r.name ?? "",
          price: KZT.format(Number(r.price) || 0),
          isFavorite: r.isFavorite ?? false,
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
        <CategoryFilter
          categories={ALL}
          selectedIds={selected}
          onChange={setSelected}
          multi={true}
          onOpenFilter={() => console.log("open filter modal")}
        />

        {isLoading ? (
          <div style={{ padding: 16 }}>Загрузка…</div>
        ) : (
          <CourseGrid courses={filtered} />
        )}
      </div>
    </section>
  );
};

export default Classes;
