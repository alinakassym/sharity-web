// sharity-web/src/pages/MyPublications.tsx

import type { FC } from "react";
import { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { useUserProducts } from "@/hooks/useUserProducts";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import SearchHeader from "@/components/SearchHeader";
import ProductCard from "@/components/ProductCard";
import LoadingScreen from "@/components/LoadingScreen";
import Container from "@/components/Container";

const KZT = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

const MyPublications: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const paddingTop = useSafePaddingTop(48, 0);
  const platformName = useSafePlatform();
  const { products, isLoading, error } = useUserProducts();
  const [searchValue, setSearchValue] = useState("");

  // Фильтрация продуктов по поисковому запросу
  const filteredProducts = products?.filter((product) =>
    product.name?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  if (isLoading) return <LoadingScreen />;

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
      {/* Search Header */}
      <SearchHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        backTo="/profile"
      />

      {/* Main Content */}
      <div
        style={{
          paddingTop: 16,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Заголовок */}
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: c.text,
            margin: 0,
          }}
        >
          Мои публикации
        </h1>

        {/* Состояния загрузки и ошибки */}
        {error && (
          <div
            style={{
              color: c.error || "#FF6B6B",
              textAlign: "center",
              padding: 20,
            }}
          >
            {error}
          </div>
        )}

        {/* Пустое состояние */}
        {!error && filteredProducts && filteredProducts.length === 0 && (
          <div
            style={{
              color: c.lightText,
              textAlign: "center",
              padding: 40,
            }}
          >
            {searchValue ? "Ничего не найдено" : "У вас пока нет публикаций"}
          </div>
        )}

        {/* Список публикаций */}
        {filteredProducts && filteredProducts.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
          >
            {filteredProducts.map((product) => {
              const productData = {
                id: product.id,
                image:
                  product.imagesArray && product.imagesArray.length > 0
                    ? product.imagesArray[0]
                    : "https://via.placeholder.com/300",
                category: product.category ?? "",
                title: product.name ?? "",
                price: KZT.format(product.price || 0),
              };

              return (
                <ProductCard
                  key={product.id}
                  product={productData}
                  showHeartBtn={false}
                  fromPage="/my-publications"
                />
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};

export default MyPublications;
