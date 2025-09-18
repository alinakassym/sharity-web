import type { FC } from 'react'
import { useState } from "react";
import SearchHeader from "../../components/SearchHeader";

const Store: FC = () => {
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
      <h1>Store</h1>
      <p>Продажа / Обмен / Аренда / Благотворительность.</p>
    </section>
  );
};

export default Store
