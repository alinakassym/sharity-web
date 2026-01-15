// src/components/Carousel.tsx

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
  /**
   * Включить/выключить автоматическое перелистывание
   * @default true
   */
  autoPlay?: boolean;
  /**
   * Соотношение сторон (высота/ширина)
   * Например: 140/360 ≈ 0.389 для баннера, 9/16 ≈ 0.563 для вертикального, 3/4 = 0.75
   * @default 140/360 (≈ 0.389)
   */
  aspectRatio?: number;
}

const Carousel: FC<CarouselProps> = ({
  items,
  autoPlayInterval = 3000,
  autoPlay = true,
  aspectRatio = 140 / 360,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (first real slide)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const timeoutRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const movedRef = useRef(false);

  const SWIPE_THRESHOLD = 40;

  // Create extended items array with clones for infinite effect
  // [last, ...items, first]
  const extendedItems =
    items.length > 0 ? [items[items.length - 1], ...items, items[0]] : [];

  const clearAutoPlayTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const goToPrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 1); // +1 because of the cloned first item
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Левой кнопкой мыши, или любое касание
    if (e.pointerType === "mouse" && e.button !== 0) return;

    clearAutoPlayTimeout();
    startXRef.current = e.clientX;
    movedRef.current = false;

    // чтобы корректно отработал pointerup даже если палец ушёл за пределы
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startXRef.current == null) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 6) movedRef.current = true;
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startXRef.current == null) return;

    const dx = e.clientX - startXRef.current;
    startXRef.current = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    if (dx < 0)
      goToNext(); // свайп влево -> следующий
    else goToPrev(); // свайп вправо -> предыдущий
  };

  // Handle infinite loop reset
  useEffect(() => {
    if (currentIndex === 0) {
      // We're at the clone of the last item, jump to the real last item
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(items.length);
      }, 300);
    } else if (currentIndex === extendedItems.length - 1) {
      // We're at the clone of the first item, jump to the real first item
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 300);
    }
  }, [currentIndex, items.length, extendedItems.length]);

  // Auto-play
  useEffect(() => {
    if (autoPlay && autoPlayInterval > 0) {
      timeoutRef.current = window.setTimeout(() => {
        goToNext();
      }, autoPlayInterval);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, [currentIndex, autoPlay, autoPlayInterval, goToNext]);

  if (items.length === 0) {
    return null;
  }

  // Calculate the actual index for indicators (without clones)
  const getActualIndex = () => {
    if (currentIndex === 0) return items.length - 1;
    if (currentIndex === extendedItems.length - 1) return 0;
    return currentIndex - 1;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${aspectRatio * 100}%`, // Maintain aspect ratio
        overflow: "hidden",
        backgroundColor: colors.surfaceColor,
        touchAction: "none",
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
        {extendedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
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
      {items.length > 1 && (
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
          {items.map((item, index) => {
            const actualIndex = getActualIndex();
            const isActive = index === actualIndex;

            return (
              <button
                key={item.id}
                onClick={() => goToSlide(index)}
                style={{
                  width: isActive ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: "none",
                  backgroundColor: isActive
                    ? colors.primary
                    : colors.lighter + "80",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Carousel;
