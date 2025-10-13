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
  inProgress: boolean;
}

const placementOptions: PlacementOption[] = [
  {
    id: "sale",
    title: "Продажа",
    icon: "coins",
    path: "/create",
    inProgress: false,
  },
  {
    id: "purchase",
    title: "Покупка",
    icon: "shop",
    path: "/store",
    inProgress: false,
  },
  {
    id: "rent",
    title: "Аренда",
    icon: "box-time",
    path: "/create-rent",
    inProgress: true,
  },
  {
    id: "exchange",
    title: "Обмен",
    icon: "convert-boxes",
    path: "/create-exchange",
    inProgress: true,
  },
  {
    id: "charity",
    title: "Благотворительность",
    icon: "gift",
    path: "/create-charity",
    inProgress: true,
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
              btnColor={c.controlColor}
              color={c.text}
              inProgress={o.inProgress}
              onClick={() => handleOptionClick(o.path)}
            />
          ))}
        </div>
      </div>

      {/* Admin Content */}
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
          Администратор
        </h2>

        {/* Placement Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <FullWidthButton
            label={"Добавить школу/курсы"}
            iconName="add"
            btnColor={c.controlColor}
            color={c.text}
            onClick={() => handleOptionClick("/create-course")}
          />
          <FullWidthButton
            label={"Создать событие"}
            iconName="calendar"
            btnColor={c.controlColor}
            color={c.text}
            onClick={() => handleOptionClick("/create-event")}
          />
        </div>
      </div>
    </Container>
  );
};

export default Add;
