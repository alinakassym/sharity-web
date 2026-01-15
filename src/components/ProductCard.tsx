// src/components/ProductCard.tsx

import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../theme/colors";
import HeartIcon from "./icons/HeartIcon";

export type ProductData = {
  id: string;
  image: string;
  category: string;
  title: string;
  price: string;
  isFavorite?: boolean;
};

type Props = {
  product: ProductData;
  isLiked?: boolean;
  showHeartBtn?: boolean;
  onHeartPress?: (productId: string) => void;
  fromPage?: string; // Путь страницы, с которой открывается продукт
};

export const ProductCard: FC<Props> = ({
  product,
  isLiked = false,
  showHeartBtn = true,
  onHeartPress,
  fromPage,
}) => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, {
      state: fromPage ? { from: fromPage } : undefined,
    });
  };

  return (
    <div
      style={{ background: "transparent", cursor: "pointer" }}
      onClick={handleCardClick}
    >
      {/* изображение + сердце */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            display: "block",
          }}
        />
        {showHeartBtn && (
          <button
            type="button"
            aria-label={isLiked ? "Убрать из избранного" : "В избранное"}
            onClick={(e) => {
              e.stopPropagation();
              onHeartPress?.(product.id);
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: 0,
              minWidth: 32,
              maxWidth: 32,
              height: 32,
              borderRadius: 16,
              background: "rgba(255,255,255,0.9)",
              border: "none",
              display: "flex",
              placeItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              outline: "none",
            }}
          >
            <HeartIcon isLiked={isLiked} />
          </button>
        )}
      </div>

      {/* текст */}
      <div style={{ display: "grid", gap: 0 }}>
        <div style={{ fontSize: 12, color: colors.lightText }}>
          {product.category}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.2,
            color: colors.text,
          }}
        >
          {product.title}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: colors.primary }}>
          {product.price}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
