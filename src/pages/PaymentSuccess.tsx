// src/pages/PaymentSuccess.tsx

import { useEffect, useState } from "react";
import type { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import Container from "@/components/Container";

const PaymentSuccess: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const [searchParams] = useSearchParams();

  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Получаем параметры из URL (переданные от EPAY)
  const invoiceId = searchParams.get("invoiceId");

  useEffect(() => {
    // Просто получаем orderNumber из sessionStorage для отображения
    const pendingOrderData = sessionStorage.getItem("pendingOrder");
    if (pendingOrderData) {
      const orderData = JSON.parse(pendingOrderData);
      if (orderData.orderNumber) {
        setOrderNumber(orderData.orderNumber);
      }
    }

    // НЕ создаём заказ здесь - заказ будет создан автоматически через 30 секунд после открытия виджета
    // Эта страница теперь только показывает успешный результат
  }, []);

  return (
    <Container paddingTop={64}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: 24,
          textAlign: "center",
        }}
      >
        {/* Success icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: `${c.primary}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <VuesaxIcon name="tick-circle" size={48} color={c.primary} />
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: c.text,
            margin: "0 0 12px",
          }}
        >
          Оплата прошла успешно!
        </h1>

        <p
          style={{
            fontSize: 16,
            color: c.lightText,
            margin: "0 0 8px",
            lineHeight: 1.5,
          }}
        >
          Спасибо за покупку! Ваш платеж успешно обработан.
        </p>

        {orderNumber && (
          <p
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: c.primary,
              margin: "8px 0 16px",
            }}
          >
            Номер заказа: {orderNumber}
          </p>
        )}

        {/* Debug info */}
        <div
          style={{
            fontSize: 12,
            color: c.lightText,
            margin: "8px 0 16px",
            padding: 12,
            backgroundColor: c.surfaceColor,
            borderRadius: 8,
            textAlign: "left",
            maxWidth: 400,
          }}
        >
          <div>Debug info:</div>
          <div>- Order number: {orderNumber || "null"}</div>
          <div>- Invoice ID: {invoiceId || "null"}</div>
          <div>
            Заказ будет автоматически создан через 30 секунд после оплаты
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <button
            onClick={() => navigate("/orders")}
            style={{
              padding: "16px",
              backgroundColor: c.primary,
              color: c.lighter,
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Мои заказы
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "16px",
              backgroundColor: c.controlColor,
              color: c.text,
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            На главную
          </button>
        </div>
      </div>
    </Container>
  );
};

export default PaymentSuccess;
