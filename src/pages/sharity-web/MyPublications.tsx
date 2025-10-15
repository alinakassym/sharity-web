import type { FC } from "react";
import { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import { useRequestGetUserProducts } from "@/hooks/useRequestGetUserProducts";
import SearchHeader from "@/components/SearchHeader";
import ProductCard from "@/components/ProductCard";
import LoadingScreen from "@/components/LoadingScreen";

const MyPublications: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();
  const { products, isLoading, error } = useRequestGetUserProducts();
  const [searchValue, setSearchValue] = useState("");

  // Фильтрация продуктов по поисковому запросу
  const filteredProducts = products?.filter((product) =>
    product.name?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <section
      style={{
        paddingTop: isTelegram ? 112 : 64,
        minHeight: "100vh",
        paddingBottom: "74px",
        backgroundColor: c.background,
      }}
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
          paddingTop: isTelegram ? 156 : 64,
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
              // Преобразуем данные из Firebase в формат ProductCard
              const productData = {
                id: product.id,
                image:
                  product.imagesArray && product.imagesArray.length > 0
                    ? product.imagesArray[0]
                    : "https://via.placeholder.com/300",
                category: product.category || "Без категории",
                title: product.name || "Без названия",
                price: product.price ? `${product.price} ₽` : "Цена не указана",
                isFavorite: product.isFavorite || false,
              };

              return (
                <ProductCard
                  key={product.id}
                  product={productData}
                  showHeartBtn={false}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyPublications;
