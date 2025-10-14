import type { FC } from "react";
import { useMemo } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import Carousel from "@/components/Carousel";
import MenuButtons from "@/components/MenuButtons";
import EventsCarousel from "@/components/EventsCarousel";
import Container from "@/components/Container";
import { useRequestGetEvents } from "@/hooks/useRequestGetEvents";
import bannerImage from "@/assets/banner.png";
import menuImg1 from "@/assets/menu-img1.png";
import menuImg2 from "@/assets/menu-img2.jpg";
import menuImg3 from "@/assets/menu-img3.png";

const Home: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  const { events: eventsFromFirebase, isLoading } = useRequestGetEvents();

  const carouselItems = [
    {
      id: "1",
      image: bannerImage,
      alt: "INTERTOP - Мечтай. Играй. Побеждай!",
    },
    {
      id: "2",
      image: "https://picsum.photos/400/200?random=1",
      alt: "Banner 2",
    },
    {
      id: "3",
      image: "https://picsum.photos/400/200?random=2",
      alt: "Banner 3",
    },
  ];

  const menuItems = [
    {
      id: "classes",
      image: menuImg1,
      label: "КЛАССЫ",
      path: "/classes",
    },
    {
      id: "events",
      image: menuImg2,
      label: "СОБЫТИЯ",
      path: "/events",
    },
    {
      id: "store",
      image: menuImg3,
      label: "МАГАЗИН",
      path: "/store",
    },
  ];

  // Преобразуем данные из Firebase в формат для EventsCarousel
  const upcomingEvents = useMemo(() => {
    return eventsFromFirebase
      .sort((a, b) => {
        // Сортируем по дате от раннего к позднему
        const dateA =
          a.date instanceof Date
            ? a.date
            : a.date?.toDate
              ? a.date.toDate()
              : new Date(a.date);
        const dateB =
          b.date instanceof Date
            ? b.date
            : b.date?.toDate
              ? b.date.toDate()
              : new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .map((event, index) => {
        // Приоритет отображения изображений:
        // 1. Первое изображение из imagesArray
        // 2. Поле image (для совместимости)
        // 3. Fallback заглушка
        let imageUrl = `https://picsum.photos/320/200?random=${index + 10}`;

        if (event.imagesArray && event.imagesArray.length > 0) {
          imageUrl = event.imagesArray[0];
        } else if (event.image) {
          imageUrl = event.image;
        }

        // Форматируем дату
        let formattedDate = "";
        if (event.date) {
          try {
            const dateObj =
              event.date instanceof Date
                ? event.date
                : event.date.toDate
                  ? event.date.toDate()
                  : new Date(event.date);

            formattedDate = `${dateObj.getDate()} ${dateObj
              .toLocaleDateString("ru-RU", { month: "short" })
              .toUpperCase()
              .replace(".", "")}`;
          } catch (e) {
            console.error("Ошибка форматирования даты:", e);
          }
        }

        return {
          id: event.id,
          image: imageUrl,
          date: formattedDate,
          time: event.time ?? "",
          title: event.name ?? "",
          location: event.location ?? "",
          url: event.url ?? "",
          participants: event.participants ?? 0,
          participantAvatars: event.participantAvatars ?? [],
        };
      });
  }, [eventsFromFirebase]);

  return (
    <Container showLocationHeader paddingTop={isTelegram ? 92 : 46}>
      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          backgroundColor: c.surfaceColor,
        }}
      >
        {/* Carousel Banner */}
        <Carousel items={carouselItems} autoPlayInterval={3000} />

        {/* Menu Buttons */}
        <MenuButtons items={menuItems} />

        {/* Upcoming Events */}
        {isLoading ? (
          <div
            style={{
              padding: 16,
              textAlign: "center",
              color: c.lightText,
              backgroundColor: c.background,
            }}
          >
            Загрузка событий...
          </div>
        ) : (
          <EventsCarousel events={upcomingEvents} />
        )}
      </div>
    </Container>
  );
};

export default Home;
