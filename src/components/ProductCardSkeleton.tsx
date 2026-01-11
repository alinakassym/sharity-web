// sharity-web/src/components/ProductCardSkeleton.tsx

import { type FC } from "react";
import { Skeleton } from "@mui/material";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

const ProductCardSkeleton: FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <div style={{ background: "transparent" }}>
      {/* Изображение + сердце */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <Skeleton
          variant="rounded"
          width="100%"
          sx={{
            aspectRatio: "1 / 1",
            borderRadius: "12px",
          }}
        />
        {/* Кнопка сердечка */}
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
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
