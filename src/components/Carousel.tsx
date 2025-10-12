import type { FC } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
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
}

const Carousel: FC<CarouselProps> = ({ items, autoPlayInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const timeoutRef = useRef<number | null>(null);

  // Aspect ratio: 113:360 (height:width)
  const aspectRatio = 113 / 360;

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % items.length;
    goToSlide(nextIndex);
  }, [currentIndex, items.length]);

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
  }, [currentIndex, autoPlayInterval, goToNext]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${aspectRatio * 100}%`, // Maintain aspect ratio
        overflow: "hidden",
        backgroundColor: colors.surfaceColor,
      }}
    >
      {/* Images */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          transition: isTransitioning ? "transform 0.3s ease-in-out" : "none",
          transform: `translateX(-${currentIndex * 100}%)`,
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
                index === currentIndex ? colors.primary : colors.lighter + "80",
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
