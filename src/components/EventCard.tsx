import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./VuesaxIcon";

interface EventCardProps {
  id: string;
  image: string;
  date: string;
  time: string;
  title: string;
  location: string;
  participants: number;
  participantAvatars?: string[];
}

const EventCard: FC<EventCardProps> = ({
  id,
  image,
  date,
  time,
  title,
  location,
  participants,
  participantAvatars = [],
}) => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const handleViewAll = () => {
    navigate(`/events/${id}`);
  };

  return (
    <div
      style={{
        minWidth: 320,
        maxWidth: 320,
        borderRadius: 20,
        backgroundColor: colors.surfaceColor,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image with Date Badge */}
      <div style={{ position: "relative", height: 200 }}>
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
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: colors.lighter,
              margin: "0 0 8px",
            }}
          >
            {title}
          </h3>

          <button
            onClick={handleViewAll}
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
            Регистрация
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
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

        {/* View All Button */}
        <button
          onClick={handleViewAll}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: 14,
            fontWeight: 500,
            color: colors.lightText,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 12,
          }}
        >
          Смотреть все
          <VuesaxIcon name="arrow-right" size={16} color={colors.lightText} />
        </button>

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
              color: colors.text,
            }}
          >
            {location}
          </span>
        </div>

        {/* Participants */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Avatars */}
          <div style={{ display: "flex", marginLeft: -4 }}>
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
      </div>
    </div>
  );
};

export default EventCard;
