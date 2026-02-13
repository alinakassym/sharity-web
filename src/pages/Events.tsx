import { useState, useMemo, type FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import Container from "@/components/Container";
import SearchHeader from "@/components/SearchHeader";
import DateFilter, { type DateFilterOption } from "@/components/DateFilter";
import EventCard from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";

const Events: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  const [searchValue, setSearchValue] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("all");

  const { events, isLoading } = useEvents();

  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .map((event, index) => {
        // Обработка изображений
        const imageUrl =
          event.imagesArray && event.imagesArray.length > 0
            ? event.imagesArray[0]
            : `https://picsum.photos/320/200?random=${index + 10}`;

        // Обработка даты (API возвращает ISO-строку)
        const eventDate = event.date ? new Date(event.date) : null;
        const formattedDate = eventDate
          ? `${eventDate.getDate()} ${eventDate
              .toLocaleDateString("ru-RU", { month: "short" })
              .toUpperCase()
              .replace(".", "")}`
          : "";

        return {
          id: event.id,
          image: imageUrl,
          date: formattedDate,
          time: event.time ?? "",
          title: event.name ?? "",
          location: event.location ?? "",
          url: event.url ?? "",
          participants: 0,
          participantAvatars: [] as string[],
          eventDate,
        };
      })
      .filter((event) => {
        // Фильтр по поиску
        const query = searchValue.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          event.title.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query);

        // Фильтр по дате
        let matchesDate = true;
        if (event.eventDate) {
          const eventDay = new Date(event.eventDate);
          eventDay.setHours(0, 0, 0, 0);

          switch (dateFilter) {
            case "all":
              matchesDate = true; // Показываем все события
              break;

            case "today":
              matchesDate = eventDay.getTime() === today.getTime();
              break;

            case "this-week": {
              const monday = new Date(today);
              const diff = today.getDay() === 0 ? -6 : 1 - today.getDay();
              monday.setDate(today.getDate() + diff);

              const sunday = new Date(monday);
              sunday.setDate(monday.getDate() + 6);
              sunday.setHours(23, 59, 59, 999);

              matchesDate =
                eventDay.getTime() >= monday.getTime() &&
                eventDay.getTime() <= sunday.getTime();
              break;
            }

            case "weekend": {
              const dayOfWeek = today.getDay();
              let saturdayDate: Date;
              let sundayDate: Date;

              if (dayOfWeek === 0) {
                // Сегодня воскресенье - показываем следующие выходные
                saturdayDate = new Date(today);
                saturdayDate.setDate(today.getDate() + 6);
                sundayDate = new Date(today);
                sundayDate.setDate(today.getDate() + 7);
              } else if (dayOfWeek === 6) {
                // Сегодня суббота
                saturdayDate = new Date(today);
                sundayDate = new Date(today);
                sundayDate.setDate(today.getDate() + 1);
              } else {
                // Будни - показываем ближайшие выходные
                const daysUntilSaturday = 6 - dayOfWeek;
                saturdayDate = new Date(today);
                saturdayDate.setDate(today.getDate() + daysUntilSaturday);
                sundayDate = new Date(today);
                sundayDate.setDate(today.getDate() + daysUntilSaturday + 1);
              }

              sundayDate.setHours(23, 59, 59, 999);

              matchesDate =
                eventDay.getTime() >= saturdayDate.getTime() &&
                eventDay.getTime() <= sundayDate.getTime();
              break;
            }
          }
        }

        return matchesSearch && matchesDate;
      });
  }, [events, searchValue, dateFilter]);

  return (
    <Container paddingTop={isTelegram ? 112 : 64}>
      <SearchHeader searchValue={searchValue} onSearchChange={setSearchValue} />
      <DateFilter selected={dateFilter} onChange={setDateFilter} />

      <div style={{ padding: 16, backgroundColor: c.background }}>
        {isLoading ? (
          <div style={{ textAlign: "center", color: c.lightText, padding: 32 }}>
            Загрузка событий...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ textAlign: "center", color: c.lightText, padding: 32 }}>
            Событий не найдено
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                {...event}
                cardWidth={"100%"}
                cardHeight={230}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Events;
