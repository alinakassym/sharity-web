import { useEffect } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import { Colors } from "@/theme/colors";
import Container from "@/components/Container";
import FullWidthButton from "@/components/FullWidthButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
  const paddingTop = useSafePaddingTop(48, 0);
  const platformName = useSafePlatform();
  const { userData, isLoading } = useCurrentUser();

  // Защита: перенаправляем на /auth-required если isConfirmed === false
  useEffect(() => {
    if (!isLoading && userData && userData.isConfirmed === false) {
      navigate("/auth-required", { replace: true });
    }
  }, [isLoading, userData, navigate]);

  const handleOptionClick = (path: string) => {
    // Передаем информацию о текущей странице для правильной навигации назад
    navigate(path, { state: { from: "/add" } });
  };

  // Проверяем, имеет ли пользователь доступ к админ-функциям
  const hasAdminAccess =
    userData?.role === "admin" || userData?.role === "manager";

  return (
    <Container
      showLocationHeader
      paddingTop={platformName === "desktop" ? 48 : paddingTop}
    >
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
          {placementOptions.map((o, indx) => (
            <FullWidthButton
              key={o.id + indx}
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
            disabled={!hasAdminAccess}
            onClick={() => handleOptionClick("/create-course")}
          />
          <FullWidthButton
            label={"Создать событие"}
            iconName="calendar"
            btnColor={c.controlColor}
            color={c.text}
            disabled={false}
            onClick={() => handleOptionClick("/create-event")}
          />
        </div>
      </div>
    </Container>
  );
};

export default Add;
