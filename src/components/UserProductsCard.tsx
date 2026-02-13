import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { useRequestGetUserProducts } from "@/hooks/useRequestGetUserProducts";
import ProductCard from "./ProductCard";

const UserProductsCard: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const { products, isLoading, error } = useRequestGetUserProducts();

  if (!products) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: c.surfaceColor,
        borderRadius: 20,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Заголовок */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: c.text,
        }}
      >
        Мои публикации
      </div>

      {/* Состояния загрузки и ошибки */}
      {isLoading && (
        <div
          style={{
            color: c.lightText,
            textAlign: "center",
            padding: 20,
          }}
        >
          Загрузка публикаций...
        </div>
      )}

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

      {/* Список публикаций */}
      {!isLoading && !error && products.length === 0 && (
        <div
          style={{
            color: c.lightText,
            textAlign: "center",
            padding: 20,
          }}
        >
          У вас пока нет публикаций
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {products.map((product) => {
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
  );
};

export default UserProductsCard;
