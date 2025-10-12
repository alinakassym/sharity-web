import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import MainTabBar from "@/components/MainTabBar";

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
    icon: "💲",
    path: "/create",
  },
  {
    id: "rent",
    title: "Аренда",
    icon: "📦",
    path: "/create-rent",
  },
  {
    id: "exchange",
    title: "Обмен",
    icon: "🔄",
    path: "/create-exchange",
  },
  {
    id: "charity",
    title: "Благотворительность",
    icon: "🎁",
    path: "/create-charity",
  },
];

const Add: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const handleOptionClick = (path: string) => {
    navigate(path);
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        paddingBottom: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: colors.primary + "20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 20 }}>📍</span>
        </div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: colors.text,
            margin: 0,
          }}
        >
          Астана
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ padding: "0 16px" }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: colors.text,
            margin: "0 0 24px",
          }}
        >
          Выбрать тип размещения
        </h2>

        {/* Placement Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {placementOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "20px 24px",
                backgroundColor: colors.surfaceColor,
                border: "none",
                borderRadius: 16,
                cursor: "pointer",
                transition: "all 0.2s ease",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.controlColor;
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.surfaceColor;
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {option.icon}
              </div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.text,
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {option.title}
              </span>
            </button>
          ))}
        </div>

        {/* Admin Section */}
        <div style={{ marginTop: 48 }}>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.text,
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
              backgroundColor: colors.surfaceColor,
              border: "none",
              borderRadius: 16,
              cursor: "pointer",
              width: "100%",
              transition: "all 0.2s ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.controlColor;
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.surfaceColor;
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
                backgroundColor: colors.background,
                borderRadius: 12,
              }}
            >
              ➕
            </div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: colors.text,
                flex: 1,
                textAlign: "left",
              }}
            >
              Добавить школу
            </span>
          </button>
        </div>
      </div>

      <MainTabBar />
    </section>
  );
};

export default Add;
