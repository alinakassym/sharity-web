import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";

interface EventCardProps {
  id: string;
  image: string;
  date: string;
  time: string;
  title: string;
  location: string;
  url?: string;
  participants?: number;
  participantAvatars?: string[];
  showParticipants?: boolean;
  cardWidth?: string | number;
  cardHeight?: string | number;
}

const EventCard: FC<EventCardProps> = ({
  id,
  image,
  date,
  time,
  title,
  location,
  url,
  participants,
  participantAvatars = [],
  showParticipants = false,
  cardWidth = 320,
  cardHeight = 320,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const handleRegistration = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div
      key={id}
      style={{
        minWidth: cardWidth,
        maxWidth: cardWidth,
        borderRadius: 20,
        backgroundColor: colors.surfaceColor,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image with Date Badge */}
      <div style={{ position: "relative", height: cardHeight }}>
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Date Badge */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: colors.primary + "E6",
            borderRadius: 12,
            padding: "8px 12px",
            textAlign: "center",
            minWidth: 60,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.lighter,
              lineHeight: 1,
            }}
          >
            {date.split(" ")[0]}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: colors.lighter,
              marginTop: 2,
            }}
          >
            {date.split(" ")[1]}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.lighter,
              marginTop: 4,
            }}
          >
            {time}
          </div>
        </div>

        {/* Title and Button Overlay */}
        {url && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 16,
              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            }}
          >
            <button
              onClick={handleRegistration}
              style={{
                backgroundColor: colors.text,
                color: colors.background,
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Подробнее
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        {/* Title */}
        <div>
          {/* Title */}
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: colors.text,
              margin: "0 0 12px",
            }}
          >
            {title}
          </h3>
        </div>

        {/* Location */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <VuesaxIcon name="location" size={20} color={colors.lightText} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: colors.lightText,
            }}
          >
            {location}
          </span>
        </div>

        {/* Participants */}
        {showParticipants && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Avatars */}
            <div style={{ display: "flex", marginLeft: 8 }}>
              {participantAvatars.slice(0, 4).map((avatar, index) => (
                <div
                  key={index}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `2px solid ${colors.background}`,
                    marginLeft: -8,
                    backgroundColor: colors.surfaceColor,
                  }}
                >
                  <img
                    src={avatar}
                    alt={`Participant ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Participant Count */}
            <span
              style={{
                fontSize: 14,
                color: colors.lightText,
              }}
            >
              +{participants} участников
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
