import { useState } from "react";
import type { FC } from "react";
import ProductCard, { type ProductData } from "./ProductCard";

type Props = {
  products: ProductData[];
  gap?: number;
  minWidth?: number; // минимальная ширина карточки для авто-сетки
};

export const ProductGrid: FC<Props> = ({ products, gap = 16 }) => {
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
