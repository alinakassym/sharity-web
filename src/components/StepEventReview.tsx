import type { FC } from "react";
import EventCard from "@/components/EventCard";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";

interface StepEventReviewProps {
  eventName: string;
  date: Date | undefined;
  time: string;
  location: string;
  url: string;
  description: string;
  selectedFile: File | null;
}

export const StepEventReview: FC<StepEventReviewProps> = ({
  eventName,
  date,
  time,
  location,
  url,
  description,
  selectedFile,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <EventCard
          image={
            selectedFile
              ? URL.createObjectURL(selectedFile)
              : "https://picsum.photos/600?preview"
          }
          date={
            date
              ? `${date.getDate()} ${date
                  .toLocaleDateString("ru-RU", {
                    month: "short",
                  })
                  .toUpperCase()
                  .replace(".", "")}`
              : ""
          }
          time={time}
          title={eventName}
          location={location}
          url={url}
          id="preview"
        />
      </div>

      {description && (
        <div
          style={{
            padding: 16,
            backgroundColor: c.surfaceColor,
            borderRadius: 12,
            marginTop: 8,
          }}
        >
          <h4
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: c.text,
              margin: "0 0 8px",
            }}
          >
            Описание
          </h4>
          <p
            style={{
              fontSize: 14,
              color: c.text,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  );
};
