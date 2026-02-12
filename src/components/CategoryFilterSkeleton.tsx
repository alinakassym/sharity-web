// src/components/CategoryFilterSkeleton.tsx

import { type FC } from "react";
import { Skeleton } from "@mui/material";

const CategoryFilterSkeleton: FC = () => {
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
        <Skeleton variant="text" width={60} height={24} />
      </div>

      {/* Сетка карточек-пилюль (показываем 6 скелетонов) */}
      <div
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={44}
            sx={{
              minHeight: 36,
              borderRadius: "24px",
              minWidth: "30%",
              flex: "0 0 auto",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryFilterSkeleton;
