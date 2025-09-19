import type { FC } from 'react'
import { useState } from "react";
import SearchHeader from "../../components/SearchHeader";
import CategoryFilter, { type Category } from "../../components/CategoryFilter";
import ProductGrid from "../../components/ProductGrid";
import type { ProductData } from "../../components/ProductCard";

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

const Store: FC = () => {
  const [selected, setSelected] = useState<string[]>(["gym"]);
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
        <CategoryFilter
          categories={ALL}
          selectedIds={selected}
          onChange={setSelected}
          multi={true}
          onOpenFilter={() => console.log("open filter modal")}
        />
        <ProductGrid products={MOCK} />
      </div>
    </section>
  );
};

export default Store
