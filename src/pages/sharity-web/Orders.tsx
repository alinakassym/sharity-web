import type { FC } from "react";
import { Timestamp } from "firebase/firestore";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRequestGetOrders } from "@/hooks/useRequestGetOrders";
import VuesaxIcon from "@/components/icons/VuesaxIcon";

const Orders: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();
  const { userData } = useCurrentUser();
  const { orders, isLoading } = useRequestGetOrders(
    userData?.telegramId?.toString(),
  );

  // Форматирование цены
  const KZT = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  });

  // Форматирование даты
  const formatDate = (date?: Date | Timestamp) => {
    if (!date) return "";

    // Если это Firestore Timestamp, конвертируем в Date
    let d: Date;
    if (date instanceof Timestamp) {
      d = date.toDate();
    } else if (date instanceof Date) {
      d = date;
    } else {
      // Если это что-то другое (например, объект с секундами)
      d = new Date(date as unknown as string);
    }

    return d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Статус на русском
  const getStatusLabel = (
    status: string,
  ): { text: string; color: string } => {
    switch (status) {
      case "paid":
        return { text: "Оплачен", color: c.primary };
      case "processing":
        return { text: "В обработке", color: "#FFA500" };
      case "shipped":
        return { text: "Отправлен", color: "#2196F3" };
      case "delivered":
        return { text: "Доставлен", color: "#4CAF50" };
      case "cancelled":
        return { text: "Отменен", color: "#F44336" };
      default:
        return { text: "В ожидании", color: c.lightText };
    }
  };

  return (
    <section
      style={{
        paddingTop: isTelegram ? 48 : 44,
        minHeight: "100vh",
        paddingBottom: "160px",
        backgroundColor: c.background,
      }}
    >
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Header */}
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: c.text,
            margin: 0,
          }}
        >
          Мои заказы
        </h1>

        {/* Loading */}
        {isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              color: c.lightText,
            }}
          >
            Загрузка...
          </div>
        )}

        {/* Empty state */}
        {!isLoading && orders.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              textAlign: "center",
            }}
          >
            <VuesaxIcon name="shopping-bag" size={64} color={c.lightText} />
            <p
              style={{
                fontSize: 16,
                color: c.lightText,
                margin: 0,
              }}
            >
              У вас пока нет заказов
            </p>
          </div>
        )}

        {/* Orders list */}
        {!isLoading &&
          orders.map((order) => {
            const statusInfo = getStatusLabel(order.status);
            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: c.surfaceColor,
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* Товар */}
                <div style={{ display: "flex", gap: 12 }}>
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: `1px solid ${c.border}`,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: c.lightText,
                        marginBottom: 4,
                      }}
                    >
                      {order.productCategory}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: c.text,
                        marginBottom: 8,
                      }}
                    >
                      {order.productName}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.text}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: c.primary,
                    }}
                  >
                    {KZT.format(order.totalAmount)}
                  </div>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    backgroundColor: c.border,
                  }}
                />

                {/* Информация о заказе */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    fontSize: 14,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: c.lightText }}>Номер заказа</span>
                    <span style={{ color: c.text, fontWeight: 500 }}>
                      {order.orderNumber}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: c.lightText }}>Дата заказа</span>
                    <span style={{ color: c.text }}>
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: c.lightText }}>Адрес доставки</span>
                    <span
                      style={{
                        color: c.text,
                        textAlign: "right",
                        maxWidth: "60%",
                      }}
                    >
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.street}, д.{" "}
                      {order.deliveryAddress.building}
                      {order.deliveryAddress.apartment &&
                        `, кв. ${order.deliveryAddress.apartment}`}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: c.lightText }}>Телефон</span>
                    <span style={{ color: c.text }}>
                      {order.deliveryAddress.phone}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default Orders;
