// sharity-web/src/pages/Store.tsx

import type { FC } from "react";
import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import SearchHeader from "@/components/SearchHeader";
import CategoryFilter, { type Category } from "@/components/CategoryFilter";
import CategoryFilterSkeleton from "@/components/CategoryFilterSkeleton";
import ProductGrid from "@/components/ProductGrid";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import type { ProductData } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useFavorites } from "@/hooks/useFavorites";
import Container from "@/components/Container";

const KZT = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

const Store: FC = () => {
  const location = useLocation();

  const scheme = useColorScheme();
  const c = Colors[scheme];

  const paddingTop = useSafePaddingTop(48, 0);
  const platformName = useSafePlatform();

  const [selected, setSelected] = useState<string[]>([]); // пусто = все категории
  const [searchValue, setSearchValue] = useState("");

  const { products: rows, isLoading: isLoadingProducts } = useProducts();
  const { categories: categoriesFromAPI, isLoading: isLoadingCategories } =
    useCategories();

  // Получаем список избранных продуктов текущего пользователя
  const { favorites: favoriteProductIds } = useFavorites("product");

  // Определяем, откуда была открыта страница
  const backTo = (location.state as { from?: string })?.from || "/";

  // Преобразуем категории из API в формат Category для CategoryFilter
  const categories: Category[] = useMemo(() => {
    return categoriesFromAPI
      .filter((cat) => cat.is_active)
      .map((cat) => ({
        id: cat.name_ru,
        label: cat.name_ru,
        icon: cat.icon || "category",
      }));
  }, [categoriesFromAPI]);

  // API -> ProductData (для грида)
  const products: ProductData[] = useMemo(
    () =>
      rows.map((r, i) => ({
        id: r.id,
        image:
          r.imagesArray && r.imagesArray.length > 0
            ? r.imagesArray[0]
            : `https://picsum.photos/600?${i + 1}`,
        category: r.category ?? "",
        title: r.name ?? "",
        price: KZT.format(r.price || 0),
        isFavorite: r.isFavorite ?? false,
      })),
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
      // Проверяем, выбрана ли категория "Избранное"
      const isFavoritesSelected = selectedLabels.has("Избранное");

      // Фильтрация по категориям
      let byCat = true;
      if (selectedLabels.size > 0) {
        if (isFavoritesSelected) {
          // Если выбрано "Избранное" - показываем только избранные продукты пользователя
          byCat = favoriteProductIds.has(p.id);
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
  }, [products, selectedLabels, searchValue, favoriteProductIds]);

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
      <SearchHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        backTo={backTo}
      />
      <div
        style={{
          paddingTop: 16,
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 80,
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

        {isLoadingProducts ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <ProductGrid products={filtered} fromPage={backTo} />
        )}
      </div>
    </Container>
  );
};

export default Store;
