import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import EventCard from "./EventCard";

interface Event {
  id: string;
  image: string;
  date: string;
  time: string;
  title: string;
  location: string;
  participants: number;
  participantAvatars?: string[];
}

interface EventsCarouselProps {
  title?: string;
  events: Event[];
}

const EventsCarousel: FC<EventsCarouselProps> = ({
  title = "Предстоящие события",
  events,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  if (events.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: colors.background,
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: colors.text,
          margin: "0 0 16px",
          padding: "0 16px",
        }}
      >
        {title}
      </h2>

      {/* Horizontal Scrollable Container */}
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          gap: 16,
          paddingLeft: 16,
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
        className="hide-scrollbar"
      >
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>

      {/* Hide scrollbar for Webkit browsers */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default EventsCarousel;
