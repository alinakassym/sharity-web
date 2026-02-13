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
import { useSubcategories } from "@/hooks/useSubcategories";
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
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [selectedSaleType, setSelectedSaleType] = useState<
    "group" | "individual" | null
  >(null);
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

  // Lookup: name_ru → id для получения подкатегорий
  const categoryNameToId = useMemo(() => {
    const map = new Map<string, string>();
    categoriesFromAPI.forEach((cat) => map.set(cat.name_ru, cat.id));
    return map;
  }, [categoriesFromAPI]);

  // Подкатегории для единственной выбранной категории
  const selectedCategoryId =
    selected.length === 1 && selected[0] !== "Избранное"
      ? categoryNameToId.get(selected[0]) ?? null
      : null;

  const { subcategories, isLoading: isLoadingSubcategories } =
    useSubcategories(selectedCategoryId);
  const activeSubcategories = subcategories.filter((s) => s.is_active);

  const handleCategoryChange = (next: string[]) => {
    setSelected(next);
    setSelectedSubs([]);
    setSelectedSaleType(null);
  };

  // Доступные типы продажи для выбранных подкатегорий
  const availableSaleTypes = useMemo(() => {
    if (selectedSubs.length === 0) return new Set<string>();
    const types = new Set<string>();
    for (const subName of selectedSubs) {
      const sub = activeSubcategories.find((s) => s.name_ru === subName);
      if (!sub) continue;
      if (sub.saleType === "all" || !sub.saleType) {
        types.add("group");
        types.add("individual");
      } else {
        types.add(sub.saleType);
      }
    }
    return types;
  }, [selectedSubs, activeSubcategories]);

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
        subcategory: r.subcategory ?? "",
        saleType: r.saleType,
        title: r.name ?? "",
        price: KZT.format(r.price || 0),
      })),
    [rows],
  );

  // выбранные ярлыки категорий
  const selectedLabels = useMemo(() => {
    return new Set(selected);
  }, [selected]);

  // фильтрация по категориям, подкатегориям и поиску
  const selectedSubSet = useMemo(() => new Set(selectedSubs), [selectedSubs]);

  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return products.filter((p) => {
      // Проверяем, выбрана ли категория "Избранное"
      const isFavoritesSelected = selectedLabels.has("Избранное");

      // Фильтрация по категориям
      let byCat = true;
      if (selectedLabels.size > 0) {
        if (isFavoritesSelected) {
          byCat = favoriteProductIds.has(p.id);
        } else {
          byCat = selectedLabels.has(p.category);
        }
      }

      // Фильтрация по подкатегориям
      const bySub =
        selectedSubSet.size === 0 ||
        selectedSubSet.has(p.subcategory ?? "");

      // Фильтрация по типу продажи
      const effectiveSaleType =
        selectedSaleType ??
        (availableSaleTypes.size === 1
          ? (availableSaleTypes.values().next().value as string)
          : null);
      const bySaleType =
        !effectiveSaleType || p.saleType === effectiveSaleType;

      // Фильтрация по поиску
      const byQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return byCat && bySub && bySaleType && byQuery;
    });
  }, [products, selectedLabels, selectedSubSet, selectedSaleType, availableSaleTypes, searchValue, favoriteProductIds]);

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
          paddingTop: 10,
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
            onChange={handleCategoryChange}
            multi={true}
            onOpenFilter={() => console.log("open filter modal")}
          />
        )}

        {/* Подкатегории */}
        {!isLoadingSubcategories && activeSubcategories.length > 0 && (
          <div
            style={{
              paddingLeft: 16,
              marginLeft: -16,
              marginRight: -16,
              width: "calc(100% + 32px)",
              display: "flex",
              gap: 8,
              overflowX: "auto",
            }}
          >
            {activeSubcategories.map((sub) => {
              const active = selectedSubSet.has(sub.name_ru);
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubs((prev) => {
                      const next = prev.includes(sub.name_ru)
                        ? prev.filter((s) => s !== sub.name_ru)
                        : [...prev, sub.name_ru];
                      // Сбрасываем фильтр типа продажи при изменении подкатегорий
                      setSelectedSaleType(null);
                      return next;
                    });
                  }}
                  style={{
                    padding: "6px 14px",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 20,
                    backgroundColor: active ? c.primary : c.controlColor,
                    color: active ? c.lighter : c.text,
                    fontSize: 12,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    outline: "none",
                  }}
                >
                  {sub.name_ru}
                </button>
              );
            })}
          </div>
        )}

        {/* Тип продажи */}
        {availableSaleTypes.size === 2 && (
          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            {(
              [
                { key: "group", label: "Для группы" },
                { key: "individual", label: "Индивидуально" },
              ] as const
            ).map(({ key, label }) => {
              const active = selectedSaleType === key;
              return (
                <button
                  key={key}
                  onClick={() =>
                    setSelectedSaleType((prev) => (prev === key ? null : key))
                  }
                  style={{
                    padding: "6px 14px",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 20,
                    backgroundColor: active ? c.primary : c.controlColor,
                    color: active ? c.lighter : c.text,
                    fontSize: 12,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    outline: "none",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
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
