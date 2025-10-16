// src/pages/Store.tsx
import type { FC } from "react";
import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import SearchHeader from "@/components/SearchHeader";
import CategoryFilter, { type Category } from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import type { ProductData } from "@/components/ProductCard";
import { useRequestGetProducts } from "@/hooks/useRequestGetProducts";
import { useRequestGetCategories } from "@/hooks/useRequestGetCategories";

const KZT = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

const Store: FC = () => {
  const location = useLocation();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();
  const [selected, setSelected] = useState<string[]>([]); // пусто = все категории
  const [searchValue, setSearchValue] = useState("");

  const { products: rows, isLoading: isLoadingProducts } =
    useRequestGetProducts();
  const {
    categories: categoriesFromFirebase,
    isLoading: isLoadingCategories,
  } = useRequestGetCategories();

  // Определяем, откуда была открыта страница
  const backTo = (location.state as { from?: string })?.from || "/";

  // Преобразуем категории из Firebase в формат Category для CategoryFilter
  const categories: Category[] = useMemo(() => {
    return categoriesFromFirebase.map((cat) => ({
      id: cat.name_ru, // Используем русское название как ID для фильтрации
      label: cat.name_ru,
      icon: cat.icon || "category", // Fallback иконка если не указана
    }));
  }, [categoriesFromFirebase]);

  // Firestore -> ProductData (для грида)
  const products: ProductData[] = useMemo(
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
    return products.filter((p) => {
      const byCat = selectedLabels.size === 0 || selectedLabels.has(p.category);
      const byQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return byCat && byQuery;
    });
  }, [products, selectedLabels, searchValue]);

  return (
    <section
      style={{
        paddingTop: isTelegram ? 112 : 64,
        minHeight: "100vh",
        paddingBottom: "74px",
        backgroundColor: c.background,
      }}
    >
      <SearchHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        backTo={backTo}
      />
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

        {isLoadingProducts ? (
          <div style={{ padding: 16 }}>Загрузка товаров…</div>
        ) : (
          <ProductGrid products={filtered} fromPage={backTo} />
        )}
      </div>
    </section>
  );
};

export default Store;
