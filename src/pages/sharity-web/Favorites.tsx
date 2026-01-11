import type { FC } from "react";
import { useState, useMemo } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import SearchHeader from "@/components/SearchHeader";
import type { ProductData } from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import { useRequestGetProducts } from "@/hooks/useRequestGetProducts";
import { useFavorites } from "@/hooks/useFavorites";

const KZT = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

const Favorites: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();
  const [searchValue, setSearchValue] = useState("");

  const { products: rows, isLoading } = useRequestGetProducts();
  // Получаем список избранных продуктов текущего пользователя
  const { favorites: favoriteIds, isLoading: isLoadingFavorites } =
    useFavorites("product");

  // Firestore -> ProductData (для грида), фильтруем только избранные текущего пользователя
  const products: ProductData[] = useMemo(
    () =>
      rows
        .filter((r) => favoriteIds.has(r.id)) // Фильтруем по избранному текущего пользователя
        .map((r, i) => {
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
    [rows, favoriteIds],
  );

  // фильтрация по поиску
  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return products.filter((p) => {
      return (
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, searchValue]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <section
      style={{
        paddingTop: isTelegram ? 112 : 64,
        minHeight: "100vh",
        paddingBottom: "74px",
        backgroundColor: c.background,
      }}
    >
      {/* Header с кнопкой назад */}
      <SearchHeader
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
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
        {isLoading || isLoadingFavorites ? (
          <div style={{ padding: 16 }}>Загрузка…</div>
        ) : products.length === 0 ? (
          <div
            style={{
              padding: 32,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 48 }}>💜</div>
            <div>
              <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>
                Пока нет избранных товаров
              </h3>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>
                Добавьте товары в избранное, нажав на сердечко
              </p>
            </div>
          </div>
        ) : (
          <ProductGrid products={filtered} fromPage="/favorites" />
        )}
      </div>
    </section>
  );
};

export default Favorites;
