import type { FC } from "react";
import { useState, useEffect, useRef } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

interface CarouselItem {
  id: string;
  image: string;
  alt?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
  height?: number;
}

const Carousel: FC<CarouselProps> = ({
  items,
  autoPlayInterval = 3000,
  height = 200,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const timeoutRef = useRef<number | null>(null);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    goToSlide(nextIndex);
  };

  useEffect(() => {
    if (autoPlayInterval > 0) {
      timeoutRef.current = window.setTimeout(() => {
        goToNext();
      }, autoPlayInterval);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [currentIndex, autoPlayInterval]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: height,
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: colors.surfaceColor,
      }}
    >
      {/* Images */}
      <div
        style={{
          display: "flex",
          transition: isTransitioning ? "transform 0.3s ease-in-out" : "none",
          transform: `translateX(-${currentIndex * 100}%)`,
          height: "100%",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              minWidth: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <img
              src={item.image}
              alt={item.alt || "Carousel image"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 10,
        }}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              backgroundColor:
                index === currentIndex
                  ? colors.primary
                  : colors.lighter + "80",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
