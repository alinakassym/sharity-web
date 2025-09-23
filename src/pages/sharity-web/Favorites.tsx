import type { FC } from "react";
import { useState, useMemo } from "react";
import SearchHeader from "@/components/SearchHeader";
import type { ProductData } from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import { useRequestGetProducts } from "@/hooks/useRequestGetProducts";

const KZT = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

const Favorites: FC = () => {
  const [searchValue, setSearchValue] = useState("");

  const { products: rows, isLoading } = useRequestGetProducts();

  // Firestore -> ProductData (для грида)
  const products: ProductData[] = useMemo(
    () =>
      rows.map((r, i) => ({
        id: r.id,
        image: r.image ?? `https://picsum.photos/600?${i + 1}`,
        category: r.category ?? "",
        title: r.name ?? "",
        price: KZT.format(Number(r.price) || 0),
        isFavorite: r.isFavorite ?? false,
      })),
    [rows],
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
        position: "fixed",
        left: 0,
        right: 0,
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
          height: "calc(100vh - 136px - 64px)",
          overflowY: "auto",
        }}
      >
        {isLoading ? (
          <div style={{ padding: 16 }}>Загрузка…</div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </div>
    </section>
  );
};

export default Favorites;
