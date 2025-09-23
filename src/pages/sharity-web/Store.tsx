// src/pages/Store.tsx
import type { FC } from "react";
import { useState, useMemo } from "react";
import SearchHeader from "@/components/SearchHeader";
import CategoryFilter, { type Category } from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import type { ProductData } from "@/components/ProductCard";
import { useRequestGetProducts } from "@/hooks/useRequestGetProducts";

const ALL: Category[] = [
  { id: "gym", label: "Гимнастика", icon: "gymnastics" },
  { id: "dance", label: "Танцы", icon: "dance" },
  { id: "ballet", label: "Балет", icon: "ballet" },
  { id: "volley", label: "Волейбол", icon: "volleyball" },
  { id: "tennis", label: "Теннис", icon: "tennis" },
  { id: "football", label: "Футбол", icon: "football" },
  { id: "hockey", label: "Хоккей", icon: "hockey" },
  { id: "run", label: "Бег", icon: "run" },
];

const KZT = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

const Store: FC = () => {
  const [selected, setSelected] = useState<string[]>([]); // пусто = все категории
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

  // выбранные ярлыки категорий
  const selectedLabels = useMemo(() => {
    return new Set(
      selected
        .map((id) => ALL.find((c) => c.id === id)?.label)
        .filter(Boolean) as string[],
    );
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
    <section style={{ position: "fixed", left: 0, right: 0 }}>
      <SearchHeader searchValue={searchValue} onSearchChange={setSearchValue} />

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
          <ProductGrid products={filtered} />
        )}
      </div>
    </section>
  );
};

export default Store;
