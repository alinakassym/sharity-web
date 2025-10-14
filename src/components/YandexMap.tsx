import { useEffect, useRef, useState } from "react";
import type { FC } from "react";

interface YandexMapProps {
  apiKey: string;
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (address: string, coordinates: [number, number]) => void;
  height?: number | string;
}

// Типы для Яндекс.Карт
interface YandexMapInstance {
  geoObjects: {
    add: (obj: YandexPlacemark) => void;
  };
  events: {
    add: (event: string, handler: (e: YandexMapEvent) => void) => void;
  };
}

interface YandexPlacemark {
  geometry: {
    getCoordinates: () => number[];
    setCoordinates: (coords: [number, number]) => void;
  };
  events: {
    add: (event: string, handler: () => void) => void;
  };
}

interface YandexMapEvent {
  get: (key: string) => [number, number];
}

const YandexMap: FC<YandexMapProps> = ({
  apiKey,
  center = [51.1694, 71.4491], // Астана по умолчанию
  zoom = 12,
  onLocationSelect,
  height = 400,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YandexMapInstance | null>(null);
  const placemarkRef = useRef<YandexPlacemark | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загружаем API Яндекс.Карт
  useEffect(() => {
    if (window.ymaps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      window.ymaps.ready(() => {
        setIsLoaded(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      // Очистка при размонтировании
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey]);

  // Инициализируем карту после загрузки API
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return;

    const initMap = () => {
      // Создаём карту
      const map = new window.ymaps.Map(mapContainerRef.current, {
        center,
        zoom,
        controls: ["zoomControl", "searchControl", "geolocationControl"],
      });

      mapRef.current = map;

      // Добавляем метку на карту
      const placemark = new window.ymaps.Placemark(
        center,
        {
          balloonContent: "Выбранное местоположение",
        },
        {
          preset: "islands#redDotIcon",
          draggable: true,
        },
      );

      map.geoObjects.add(placemark);
      placemarkRef.current = placemark;

      // Обработчик перетаскивания метки
      placemark.events.add("dragend", async () => {
        const coords = placemark.geometry.getCoordinates();
        const address = await getAddressFromCoords(coords as [number, number]);
        if (onLocationSelect) {
          onLocationSelect(address, coords as [number, number]);
        }
      });

      // Обработчик клика по карте
      map.events.add("click", async (e: YandexMapEvent) => {
        const coords = e.get("coords");
        placemark.geometry.setCoordinates(coords);
        const address = await getAddressFromCoords(coords);
        if (onLocationSelect) {
          onLocationSelect(address, coords);
        }
      });

      // Получаем начальный адрес
      getAddressFromCoords(center).then((address) => {
        if (onLocationSelect) {
          onLocationSelect(address, center);
        }
      });
    };

    initMap();
  }, [isLoaded, center, zoom, onLocationSelect]);

  // Функция для получения адреса по координатам
  const getAddressFromCoords = async (
    coords: [number, number],
  ): Promise<string> => {
    try {
      const result = await window.ymaps.geocode(coords);
      const firstGeoObject = result.geoObjects.get(0);
      return firstGeoObject.getAddressLine();
    } catch (error) {
      console.error("Ошибка геокодирования:", error);
      return "Адрес не определён";
    }
  };

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: 12,
        overflow: "hidden",
      }}
    />
  );
};

export default YandexMap;

// Расширяем Window для TypeScript
declare global {
  interface Window {
    ymaps: {
      ready: (callback: () => void) => void;
      Map: new (
        container: HTMLElement | null,
        options: {
          center: [number, number];
          zoom: number;
          controls: string[];
        },
      ) => YandexMapInstance;
      Placemark: new (
        coords: [number, number],
        properties: { balloonContent: string },
        options: { preset: string; draggable: boolean },
      ) => YandexPlacemark;
      geocode: (coords: [number, number]) => Promise<{
        geoObjects: {
          get: (index: number) => {
            getAddressLine: () => string;
          };
        };
      }>;
    };
  }
}
