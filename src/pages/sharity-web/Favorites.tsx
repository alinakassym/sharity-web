import type { FC } from "react";
import { useState } from "react";
import SearchHeader from "@/components/SearchHeader";
import type { ProductData } from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";

const MOCK: ProductData[] = [
  {
    id: "1",
    image: "https://picsum.photos/600?1",
    category: "Спорт/Гимнастика",
    title: "Костюм размер 23",
    price: "32 000 ₸",
  },
  {
    id: "2",
    image: "https://picsum.photos/600?2",
    category: "Спорт/Гимнастика",
    title: "Костюм",
    price: "13 000 ₸",
  },
  {
    id: "3",
    image: "https://picsum.photos/600?3",
    category: "Спорт/Теннис",
    title: "Ракетка Wilson",
    price: "25 000 ₸",
  },
  {
    id: "4",
    image: "https://picsum.photos/600?4",
    category: "Спорт/Футбол",
    title: "Бутсы Nike",
    price: "18 500 ₸",
  },
  {
    id: "5",
    image: "https://picsum.photos/600?5",
    category: "Спорт/Плавание",
    title: "Очки для плавания",
    price: "7 200 ₸",
  },
  {
    id: "6",
    image: "https://picsum.photos/600?6",
    category: "Спорт/Бокс",
    title: "Перчатки",
    price: "15 000 ₸",
  },
];

const Favorites: FC = () => {
  const [searchValue, setSearchValue] = useState("");

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
        <ProductGrid products={MOCK} />
      </div>
    </section>
  );
};

export default Favorites;
