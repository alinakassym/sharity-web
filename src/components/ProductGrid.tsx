import type { FC } from "react";
import ProductCard, { type ProductData } from "./ProductCard";
import { useFavorites } from "@/hooks/useFavorites";

type Props = {
  products: ProductData[];
  gap?: number;
  minWidth?: number; // минимальная ширина карточки для авто-сетки
  fromPage?: string; // Путь страницы, с которой открывается продукт
};

export const ProductGrid: FC<Props> = ({ products, gap = 16, fromPage }) => {
  // Используем новый хук для управления избранным
  const { isFavorite, toggleFavorite } = useFavorites("product");

  return (
    <div
      style={{
        paddingBottom: 32,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap,
      }}
    >
      {products.map((p) => (
        <div key={p.id}>
          <ProductCard
            product={p}
            isLiked={isFavorite(p.id)}
            onHeartPress={toggleFavorite}
            fromPage={fromPage}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
