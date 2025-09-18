import type { FC } from "react";
import VuesaxIcon from "./VuesaxIcon";

interface SearchHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const SearchHeader: FC<SearchHeaderProps> = ({
  searchValue,
  onSearchChange,
}) => {
  return (
    <div
      style={{
        paddingRight: 56,
        paddingBottom: 8,
        height: 48,
        display: "flex",
        flex: 1,
        alignItems: "center",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: "#F0EDE6",
      }}
    >
      <div
        style={{
          width: 56,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <VuesaxIcon name="location" size={24} color="#907BE2" />
      </div>

      <div
        style={{
          position: "relative",
          height: 40,
          display: "flex",
          flex: 1,
          borderRadius: 8,
          backgroundColor: "#F5F2F2",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 1,
            width: 40,
            maxWidth: 40,
            padding: "8px",
            color: "#7D7D7D",
          }}
        >
          <VuesaxIcon name="search" size={16} color="#999" />
        </div>
        <input
          name="search"
          type="text"
          placeholder="Поиск"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            paddingLeft: 40,
            fontSize: 16,
            width: "100%",
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
          }}
        />
      </div>
    </div>
  );
};

export default SearchHeader;
