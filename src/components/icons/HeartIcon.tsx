import type { FC } from "react";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../theme/colors";

type HeartIconProps = {
  size?: number;
  isLiked?: boolean;
  className?: string;
};

const HeartIcon: FC<HeartIconProps> = ({
  size = 16,
  isLiked = false,
  className,
}) => {
  const scheme = useColorScheme();
  const likedColor = Colors[scheme].primary;
  const unlikedColor = Colors[scheme].darken;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        d="M11.0003 3C12.5012 3.00017 13.6663 4.16605 13.6663 5.66699C13.6662 6.59841 13.2562 7.52147 12.3294 8.65527C11.3914 9.80281 10.0322 11.0406 8.2962 12.6182L8.00226 12.8828L7.70636 12.6143L7.70538 12.6123L6.47394 11.4912C5.31464 10.4253 4.37385 9.51452 3.67023 8.6543C2.74369 7.52152 2.33341 6.5984 2.33331 5.66699C2.33331 4.16594 3.49926 3 5.00031 3C5.85741 3.0001 6.69558 3.40434 7.23859 4.04199L8.00031 4.93555L8.76105 4.04199C9.30412 3.40426 10.1431 3 11.0003 3Z"
        fill={isLiked ? likedColor : "none"}
        stroke={isLiked ? likedColor : unlikedColor}
        strokeWidth={1}
      />
    </svg>
  );
};

export default HeartIcon;
