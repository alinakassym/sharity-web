import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../theme/colors";
import VuesaxIcon from "./VuesaxIcon";
import { CloseWebViewButton } from "./CloseWebViewButton";

interface SearchHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const SearchHeader: FC<SearchHeaderProps> = ({
  searchValue,
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        padding: 8,
        display: "flex",
        gap: 8,
        flex: 1,
        alignItems: "center",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceColor,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <VuesaxIcon name="location" size={24} color={colors.primary} />
      </div>
      <div
        style={{
          position: "relative",
          height: 40,
          display: "flex",
          flex: 1,
          borderRadius: 8,
          backgroundColor: colors.controlColor,
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
            color: colors.text,
            zIndex: 2,
          }}
        >
          <VuesaxIcon name="search" size={16} color={colors.lightText} />
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
            color: colors.text,
          }}
        />
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          borderRadius: 8,
          transition: "background-color 0.2s ease",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.controlColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        aria-label="Закрыть поиск"
      >
        <VuesaxIcon name="close-bold" size={20} color={colors.text} />
      </button>

      <CloseWebViewButton />
    </div>
  );
};

export default SearchHeader;
