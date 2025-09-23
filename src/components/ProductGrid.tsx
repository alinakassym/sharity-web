import { useState, useEffect } from "react";
import type { FC } from "react";
import ProductCard, { type ProductData } from "./ProductCard";
import { useRequestUpdateProduct } from "@/hooks/useRequestUpdateProduct";

type Props = {
  products: ProductData[];
  gap?: number;
  minWidth?: number; // минимальная ширина карточки для авто-сетки
};

export const ProductGrid: FC<Props> = ({ products, gap = 16 }) => {
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const { toggleFavorite } = useRequestUpdateProduct();

  // Синхронизируем локальное состояние с данными из Firebase
  useEffect(() => {
    const favoriteIds = new Set(
      products.filter(p => p.isFavorite).map(p => p.id)
    );
    setLiked(favoriteIds);
  }, [products]);

  const toggleLike = async (id: string) => {
    const currentState = liked.has(id);

    // Оптимистичное обновление UI
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    // Обновляем в Firebase
    const result = await toggleFavorite(id, currentState);

    if (!result.success) {
      // Если ошибка, возвращаем предыдущее состояние
      setLiked((prev) => {
        const next = new Set(prev);
        if (currentState) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
      console.error("Ошибка при обновлении избранного:", result.error);
    }
  };

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
            isLiked={liked.has(p.id)}
            onHeartPress={toggleLike}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
