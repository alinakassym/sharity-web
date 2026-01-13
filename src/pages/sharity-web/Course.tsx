// sharity-web/src/pages/sharity-web/Course.tsx

import type { FC } from "react";
import { useParams } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRequestGetCourse } from "@/hooks/useRequestGetCourse";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import Header from "@/components/Header";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import Carousel from "@/components/Carousel";

const Course: FC = () => {
  const { id } = useParams<{ id: string }>();
  const isTelegram = isTelegramApp();
  const { course: courseData, isLoading, error } = useRequestGetCourse(id);

  const scheme = useColorScheme();
  const c = Colors[scheme];

  const course = courseData
    ? {
        id: courseData.id,
        category: courseData.category || "",
        title: courseData.name || "",
        description: courseData.description || "",
        imagesArray:
          courseData.imagesArray?.map((imageUrl, index) => ({
            id: `${courseData.id}-${index}`,
            image: imageUrl,
            alt: courseData.name,
          })) || [],
        locations: courseData.locations || [],

        // ➕ НОВЫЕ поля
        ageFrom: courseData.ageFrom,
        ageTo: courseData.ageTo,
        priceFrom: courseData.priceFrom,
        priceText: courseData.priceText,
        scheduleText: courseData.scheduleText,
        phone: courseData.phone,
        whatsapp: courseData.whatsapp,
        telegram: courseData.telegram,
      }
    : null;

  if (isLoading) {
    return (
      <section
        style={{
          position: "fixed",
          left: 0,
          right: 0,
        }}
      >
        <Header title="Назад" showGoBackBtn />
        <div style={{ padding: 16 }}>Загрузка…</div>
      </section>
    );
  }

  if (error || !course) {
    return (
      <section
        style={{
          paddingTop: isTelegram ? 92 : 44,
          minHeight: "100vh",
          paddingBottom: "80px",
          backgroundColor: c.background,
        }}
      >
        <Header title="Назад" showGoBackBtn />
        <div style={{ padding: 16, color: c.lightText }}>
          {error || "Не найдено"}
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        paddingTop: isTelegram ? 112 : 64,
        minHeight: "100vh",
        paddingBottom: "80px",
        backgroundColor: c.background,
      }}
    >
      {/* Header с кнопкой назад */}
      <Header title="Назад" showGoBackBtn />

      {/* Контент продукта */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          height: "calc(100vh - 90px)",
          overflowY: "auto",
        }}
      >
        {/* Изображение */}
        <div>
          <Carousel
            items={course.imagesArray}
            aspectRatio={280 / 360}
            autoPlay={false}
          />
        </div>

        {/* Информация о товаре */}
        <div
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: c.lightText,
            }}
          >
            {course.category}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: c.text,
            }}
          >
            {course.title}
          </h2>

          {course.description && (
            <div
              style={{
                fontSize: 16,
                lineHeight: "1.5",
                color: c.text,
                marginTop: 16,
              }}
            >
              {course.description}
            </div>
          )}

          {/* ➕ НОВОЕ: Возраст */}
          {(course.ageFrom || course.ageTo) && (
            <div
              style={{
                padding: 16,
                backgroundColor: c.surfaceColor,
                borderRadius: 12,
                marginTop: 8,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: c.text,
                  margin: "0 0 8px",
                }}
              >
                Возраст
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: c.text,
                  margin: 0,
                }}
              >
                {course.ageFrom && `от ${course.ageFrom}`}{" "}
                {course.ageTo && `до ${course.ageTo} лет`}
              </p>
            </div>
          )}

          {/* ➕ НОВОЕ: Стоимость */}
          {(course.priceFrom || course.priceText) && (
            <div
              style={{
                padding: 16,
                backgroundColor: c.surfaceColor,
                borderRadius: 12,
                marginTop: 8,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: c.text,
                  margin: "0 0 8px",
                }}
              >
                Стоимость
              </h3>
              {course.priceFrom && (
                <p style={{ fontSize: 14, color: c.text, margin: "0 0 4px" }}>
                  От {course.priceFrom}₸
                </p>
              )}
              {course.priceText && (
                <p style={{ fontSize: 14, color: c.text, margin: 0 }}>
                  {course.priceText}
                </p>
              )}
            </div>
          )}

          {/* ➕ НОВОЕ: Расписание */}
          {course.scheduleText && (
            <div
              style={{
                padding: 16,
                backgroundColor: c.surfaceColor,
                borderRadius: 12,
                marginTop: 8,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: c.text,
                  margin: "0 0 8px",
                }}
              >
                Расписание
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: c.text,
                  margin: 0,
                }}
              >
                {course.scheduleText}
              </p>
            </div>
          )}

          {/* ➕ НОВОЕ: Локации */}
          {course.locations.length > 0 && (
            <div
              style={{
                padding: 16,
                backgroundColor: c.surfaceColor,
                borderRadius: 12,
                marginTop: 8,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: c.text,
                  margin: "0 0 8px",
                }}
              >
                Локации
              </h3>
              {course.locations.map((loc, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: index < course.locations.length - 1 ? 12 : 0,
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      color: c.text,
                      margin: "0 0 4px",
                      fontWeight: 500,
                    }}
                  >
                    {loc.location}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ➕ НОВОЕ: Контакты */}
          {(course.phone || course.whatsapp || course.telegram) && (
            <div
              style={{
                padding: 16,
                backgroundColor: c.surfaceColor,
                borderRadius: 12,
                marginTop: 8,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: c.text,
                  margin: "0 0 12px",
                }}
              >
                Контакты
              </h3>

              {course.phone && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                    color: c.primary,
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
                  <VuesaxIcon name="call" size={20} color={c.primary} />
                  <span style={{ fontSize: 14 }}>{course.phone}</span>
                </div>
              )}

              {course.whatsapp && (
                <a
                  href={`https://wa.me/${course.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                    textDecoration: "none",
                    color: c.primary,
                  }}
                >
                  <VuesaxIcon name="whatsapp" size={20} color={c.primary} />
                  <span style={{ fontSize: 14 }}>WhatsApp</span>
                </a>
              )}

              {course.telegram && (
                <a
                  href={`https://t.me/${course.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                    color: c.primary,
                  }}
                >
                  <VuesaxIcon name="message" size={20} color={c.primary} />
                  <span style={{ fontSize: 14 }}>{course.telegram}</span>
                </a>
              )}
            </div>
          )}

          {/* Кнопки действий */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              paddingBottom: 48,
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Course;
