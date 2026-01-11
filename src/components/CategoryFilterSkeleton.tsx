// sharity-web/src/components/CategoryFilterSkeleton.tsx

import { type FC } from "react";
import { Skeleton } from "@mui/material";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

const CategoryFilterSkeleton: FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <section style={{ width: "100%" }}>
      {/* Заголовок + "Фильтр" */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={60} height={20} />
      </div>

      {/* Сетка карточек-пилюль (показываем 6 скелетонов) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={48}
            sx={{
              borderRadius: "24px",
              minWidth: 120,
              flex: "0 0 auto",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryFilterSkeleton;
