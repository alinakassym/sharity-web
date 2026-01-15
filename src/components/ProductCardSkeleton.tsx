// src/components/ProductCardSkeleton.tsx

import { type FC } from "react";
import { Skeleton } from "@mui/material";

const ProductCardSkeleton: FC = () => {
  return (
    <div style={{ background: "transparent" }}>
      {/* Изображение + сердце */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <Skeleton
          variant="rounded"
          width="100%"
          sx={{
            minHeight: 213.5,
            maxHeight: 213.5,
            aspectRatio: "1 / 1",
            borderRadius: "12px",
          }}
        />
      </div>

      {/* Текст */}
      <div style={{ display: "grid", gap: 4 }}>
        {/* Категория */}
        <Skeleton variant="text" width="40%" height={16} />

        {/* Заголовок (2 строки) */}
        <Skeleton variant="text" width="90%" height={18} />
        <Skeleton variant="text" width="70%" height={18} />

        {/* Цена */}
        <Skeleton variant="text" width="50%" height={24} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
