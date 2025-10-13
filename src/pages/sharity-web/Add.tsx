import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import Container from "@/components/Container";
import FullWidthButton from "@/components/FullWidthButton";

interface PlacementOption {
  id: string;
  title: string;
  icon: string;
  path: string;
}

const placementOptions: PlacementOption[] = [
  {
    id: "sale",
    title: "Продажа",
    icon: "coins",
    path: "/create",
  },
  {
    id: "purchase",
    title: "Покупка",
    icon: "shop",
    path: "/create",
  },
  {
    id: "rent",
    title: "Аренда",
    icon: "box-time",
    path: "/create-rent",
  },
  {
    id: "exchange",
    title: "Обмен",
    icon: "convert-boxes",
    path: "/create-exchange",
  },
  {
    id: "charity",
    title: "Благотворительность",
    icon: "gift",
    path: "/create-charity",
  },
];

const Add: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];

  const handleOptionClick = (path: string) => {
    navigate(path);
  };

  return (
    <Container showLocationHeader paddingTop={92}>
      {/* Main Content */}
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: c.text,
            margin: 0,
          }}
        >
          Выбрать тип размещения
        </h2>

        {/* Placement Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {placementOptions.map((o) => (
            <FullWidthButton
              label={o.title}
              iconName={o.icon}
              color={c.controlColor}
              iconColor={c.darken}
            />
          ))}
        </div>

        {/* Admin Section */}
        <div style={{ marginTop: 48 }}>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: c.text,
              margin: "0 0 16px",
            }}
          >
            Админ
          </h3>

          <button
            onClick={() => handleOptionClick("/create-school")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "20px 24px",
              backgroundColor: c.surfaceColor,
              border: "none",
              borderRadius: 16,
              cursor: "pointer",
              width: "100%",
              transition: "all 0.2s ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.controlColor;
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = c.surfaceColor;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div
              style={{
                fontSize: 28,
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: c.background,
                borderRadius: 12,
              }}
            >
              ➕
            </div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: c.text,
                flex: 1,
                textAlign: "left",
              }}
            >
              Добавить школу
            </span>
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Add;
