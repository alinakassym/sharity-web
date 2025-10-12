import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import LocationHeader from "@/components/LocationHeader";
import Carousel from "@/components/Carousel";
import MenuButtons from "@/components/MenuButtons";
import EventsCarousel from "@/components/EventsCarousel";
import bannerImage from "@/assets/banner.png";
import menuImg1 from "@/assets/menu-img1.png";
import menuImg2 from "@/assets/menu-img2.jpg";
import menuImg3 from "@/assets/menu-img3.png";
import { isTelegramApp } from "@/lib/telegram";

const Home: FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const isTelegram = isTelegramApp();

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

  const upcomingEvents = [
    {
      id: "1",
      image: "https://picsum.photos/320/200?random=10",
      date: "30 АВГ",
      time: "12:30",
      title: "МИНИ МАРАФОН",
      location: "Триатлон парк",
      participants: 170,
      participantAvatars: [
        "https://i.pravatar.cc/150?img=1",
        "https://i.pravatar.cc/150?img=2",
        "https://i.pravatar.cc/150?img=3",
        "https://i.pravatar.cc/150?img=4",
      ],
    },
    {
      id: "2",
      image: "https://picsum.photos/320/200?random=11",
      date: "15 СЕН",
      time: "10:00",
      title: "ТАНЦЕВАЛЬНЫЙ ФЕСТИВАЛЬ",
      location: "Центр культуры",
      participants: 250,
      participantAvatars: [
        "https://i.pravatar.cc/150?img=5",
        "https://i.pravatar.cc/150?img=6",
        "https://i.pravatar.cc/150?img=7",
        "https://i.pravatar.cc/150?img=8",
      ],
    },
    {
      id: "3",
      image: "https://picsum.photos/320/200?random=12",
      date: "20 СЕН",
      time: "14:00",
      title: "ФУТБОЛЬНЫЙ ТУРНИР",
      location: "Стадион Астана",
      participants: 320,
      participantAvatars: [
        "https://i.pravatar.cc/150?img=9",
        "https://i.pravatar.cc/150?img=10",
        "https://i.pravatar.cc/150?img=11",
        "https://i.pravatar.cc/150?img=12",
      ],
    },
  ];

  return (
    <section
      style={{
        paddingTop: isTelegram ? 92 : 44,
        minHeight: "100vh",
        paddingBottom: "160px",
      }}
    >
      <LocationHeader />

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          backgroundColor: colors.surfaceColor,
        }}
      >
        {/* Carousel Banner */}
        <Carousel items={carouselItems} autoPlayInterval={3000} />

        {/* Menu Buttons */}
        <MenuButtons items={menuItems} />

        {/* Upcoming Events */}
        <EventsCarousel events={upcomingEvents} />
      </div>
    </section>
  );
};

export default Home;
