// src/components/CourseCard.tsx

import { type FC } from "react";
import { Link } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
import HeartIcon from "./icons/HeartIcon";

export type CourseData = {
  id: string;
  image: string;
  category: string;
  title: string;
  ageFrom?: number;
  ageTo?: number;
  priceFrom?: number;
  priceText?: string;
  location?: string; // первый адрес из массива locations
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  shortDescription?: string;
};

type Props = {
  course: CourseData;
  isLiked?: boolean;
  showHeartBtn?: boolean;
  onHeartPress?: (id: string) => void;
};

const CourseCard: FC<Props> = ({
  course,
  isLiked = false,
  showHeartBtn = false,
  onHeartPress,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  // Форматирование возраста
  const ageText = (() => {
    if (course.ageFrom && course.ageTo) {
      return `${course.ageFrom}–${course.ageTo} лет`;
    }
    if (course.ageFrom) {
      return `от ${course.ageFrom} лет`;
    }
    if (course.ageTo) {
      return `до ${course.ageTo} лет`;
    }
    return null;
  })();

  // Форматирование цены
  const priceText = (() => {
    if (course.priceFrom) {
      const KZT = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "KZT",
        maximumFractionDigits: 0,
      });
      return `от ${KZT.format(course.priceFrom)}`;
    }
    if (course.priceText) {
      return course.priceText;
    }
    return null;
  })();

  // Функция для очистки номера телефона (оставляем только цифры)
  const cleanPhone = (phone: string) => phone.replace(/\D/g, "");

  // Генерация ссылок для контактов
  const whatsappLink = course.whatsapp
    ? `https://wa.me/${cleanPhone(course.whatsapp)}`
    : null;
  const telegramLink = course.telegram
    ? `https://t.me/${course.telegram.replace(/^@/, "")}`
    : null;

  const chipStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: c.text,
    backgroundColor: c.background,
    padding: "6px 10px",
    borderRadius: 999,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  const actionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 600,
    color: c.text,
    backgroundColor: c.background,
    padding: "10px 12px",
    borderRadius: 12,
    lineHeight: 1,
    userSelect: "none",
    flex: 1,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: c.surfaceColor,
        position: "relative",
      }}
    >
      {/* Clickable area - Image and text */}
      <Link
        to={`/course/${course.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          gap: 12,
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Image */}
        <div
          style={{
            width: 98,
            height: 98,
            borderRadius: 14,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <img
            src={course.image}
            alt={course.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Top text */}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                color: c.lightText,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {course.category}
            </div>

            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1.3,
                color: c.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {course.title}
            </div>
          </div>

          {/* Chips row (возраст и цена) */}
          {(ageText || priceText) && (
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 2,
              }}
            >
              {ageText && <div style={chipStyle}>{ageText}</div>}
              {priceText && <div style={chipStyle}>{priceText}</div>}
            </div>
          )}
        </div>
      </Link>

      <div>
        {/* Meta (адрес) */}
        {course.location && (
          <div
            style={{
              fontSize: 12,
              lineHeight: "18px",
              color: c.lightText,
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            <span style={{ paddingTop: 2 }}>
              <VuesaxIcon name="location" size={12} />
            </span>
            <span>{course.location}</span>
          </div>
        )}
        {course?.shortDescription && (
          <div
            style={{
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
            }}
          >
            {course.shortDescription}
          </div>
        )}
      </div>
      {/* Actions row (кнопки контактов) - ВНЕ Link! */}
      {(whatsappLink || course.phone || telegramLink) && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...actionStyle,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <VuesaxIcon name="whatsapp" size={12} />
                WhatsApp
              </a>
            )}
            {course.phone && (
              <div
                style={{
                  ...actionStyle,
                  cursor: "pointer",
                }}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    await navigator.clipboard.writeText(course.phone!);
                    alert(
                      `Номер телефона скопирован в буфер обмена!\n\n${course.phone}\n\nВставьте номер в приложение для звонков.`,
                    );
                  } catch {
                    // Если копирование не сработало, показываем номер
                    alert(
                      `Номер телефона:\n${course.phone}\n\nСкопируйте номер вручную для звонка.`,
                    );
                  }
                }}
              >
                <VuesaxIcon name="call" strokeWidth={2} size={12} />
                Позвонить
              </div>
            )}
            {telegramLink && (
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...actionStyle,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <VuesaxIcon name="telegram" strokeWidth={2} size={12} />
                Telegram
              </a>
            )}
          </div>
        </div>
      )}

      {showHeartBtn && (
        <button
          type="button"
          aria-label={isLiked ? "Убрать из избранного" : "В избранное"}
          onClick={(e) => {
            e.stopPropagation();
            onHeartPress?.(course.id);
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: 0,
            minWidth: 32,
            maxWidth: 32,
            height: 32,
            borderRadius: 16,
            background: "rgba(255,255,255,0.9)",
            border: "none",
            display: "flex",
            placeItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            outline: "none",
          }}
        >
          <HeartIcon isLiked={isLiked} />
        </button>
      )}
    </div>
  );
};

export default CourseCard;
