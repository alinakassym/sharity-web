import type { FC } from 'react'
import { useState } from "react";
import SearchHeader from "../../components/SearchHeader";
import CategoryFilter, { type Category } from "../../components/CategoryFilter";

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
      <div style={{ padding: 16 }}>
        <CategoryFilter
          categories={ALL}
          selectedIds={selected}
          onChange={setSelected}
          multi={true}
          onOpenFilter={() => console.log("open filter modal")}
        />
      </div>
    </section>
  );
};

export default Store
