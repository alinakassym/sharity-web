import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

export type DateFilterOption = "all" | "today" | "this-week" | "weekend";

interface DateFilterProps {
  selected: DateFilterOption;
  onChange: (option: DateFilterOption) => void;
}

const DateFilter: FC<DateFilterProps> = ({ selected, onChange }) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  const options: Array<{
    id: DateFilterOption;
    label: string;
    subtitle: string;
  }> = [
    {
      id: "all",
      label: "Все",
      subtitle: "Все события",
    },
    {
      id: "today",
      label: "Сегодня",
      subtitle: getDateLabel("today"),
    },
    {
      id: "this-week",
      label: "На этой неделе",
      subtitle: getDateLabel("this-week"),
    },
    {
      id: "weekend",
      label: "На выходных",
      subtitle: getDateLabel("weekend"),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        padding: "16px 16px 0",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="hide-scrollbar"
    >
      {options.map((option) => {
        const isSelected = selected === option.id;

        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            style={{
              flex: "0 0 auto",
              minWidth: 150,
              padding: "12px 20px",
              borderRadius: 20,
              border: "none",
              backgroundColor: isSelected ? c.primary : c.surfaceColor,
              color: isSelected ? c.lighter : c.text,
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {option.label}
            </div>
            <div
              style={{
                fontSize: 12,
                opacity: isSelected ? 0.9 : 0.7,
              }}
            >
              {option.subtitle}
            </div>
          </button>
        );
      })}

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

// Вспомогательная функция для получения текста даты
function getDateLabel(option: DateFilterOption): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = воскресенье, 6 = суббота

  switch (option) {
    case "today": {
      const day = today.getDate();
      const month = today.toLocaleDateString("ru-RU", { month: "long" });
      return `${day} ${month}`;
    }

    case "this-week": {
      // Находим понедельник текущей недели
      const monday = new Date(today);
      const diff = today.getDay() === 0 ? -6 : 1 - today.getDay();
      monday.setDate(today.getDate() + diff);

      // Находим воскресенье текущей недели
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      return `${monday.getDate()}-${sunday.getDate()} ${monday.toLocaleDateString("ru-RU", { month: "long" })}`;
    }

    case "weekend": {
      // Находим ближайшую субботу и воскресенье
      let saturday = new Date(today);
      let sunday = new Date(today);

      if (dayOfWeek === 0) {
        // Сегодня воскресенье - показываем следующие выходные
        saturday.setDate(today.getDate() + 6);
        sunday.setDate(today.getDate() + 7);
      } else if (dayOfWeek === 6) {
        // Сегодня суббота
        saturday = new Date(today);
        sunday.setDate(today.getDate() + 1);
      } else {
        // Будни - показываем ближайшие выходные
        const daysUntilSaturday = 6 - dayOfWeek;
        saturday.setDate(today.getDate() + daysUntilSaturday);
        sunday.setDate(today.getDate() + daysUntilSaturday + 1);
      }

      return `${saturday.getDate()}-${sunday.getDate()} ${saturday.toLocaleDateString("ru-RU", { month: "long" })}`;
    }

    default:
      return "";
  }
}

export default DateFilter;
