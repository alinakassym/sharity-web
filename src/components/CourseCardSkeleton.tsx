// src/components/CourseCardSkeleton.tsx

import { type FC } from "react";
import { Skeleton } from "@mui/material";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

const CourseCardSkeleton: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: c.surfaceColor,
        position: "relative",
      }}
    >
      {/* Clickable area - Image and text */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Image Skeleton */}
        <Skeleton
          variant="rounded"
          width={96}
          height={96}
          sx={{
            borderRadius: "14px",
            flexShrink: 0,
          }}
        />

        {/* Content Skeleton */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Category */}
          <Skeleton variant="text" width="40%" height={16} />

          {/* Title (2 lines) */}
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="70%" height={20} />

          {/* Chips row (возраст и цена) */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 4,
            }}
          >
            <Skeleton variant="rounded" width={80} height={28} />
            <Skeleton variant="rounded" width={100} height={28} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div style={{ display: "flex", gap: 4 }}>
        <Skeleton variant="circular" width={12} height={12} />
        <Skeleton variant="text" width="60%" height={18} />
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
      </div>

      {/* Heart button */}
      <Skeleton
        variant="circular"
        width={32}
        height={32}
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
        }}
      />
    </div>
  );
};

export default CourseCardSkeleton;
