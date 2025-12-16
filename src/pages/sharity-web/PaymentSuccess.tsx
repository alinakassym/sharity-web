import { useEffect, useState } from "react";
import type { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import Container from "@/components/Container";
import { useRequestCreateOrder } from "@/hooks/useRequestCreateOrder";

const PaymentSuccess: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const [searchParams] = useSearchParams();
  const { createOrder } = useRequestCreateOrder();

  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);

  // Получаем параметры из URL (переданные от EPAY)
  const invoiceId = searchParams.get("invoiceId");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const saveOrder = async () => {
      // Проверяем, что заказ еще не был сохранен
      if (orderSaved || isSavingOrder) return;

      // Получаем данные заказа из sessionStorage
      const pendingOrderData = sessionStorage.getItem("pendingOrder");
      if (!pendingOrderData || !invoiceId) {
        console.warn("No pending order data or invoiceId found");
        return;
      }

      try {
        setIsSavingOrder(true);
        const orderData = JSON.parse(pendingOrderData);

        // Создаем заказ в Firebase
        const result = await createOrder({
          ...orderData,
          invoiceId, // Добавляем invoiceId от EPAY
          status: "paid", // Статус "оплачен"
        });

        if (result.success) {
          console.log("Order saved successfully:", result.id);
          setOrderSaved(true);
          // Очищаем данные из sessionStorage после успешного сохранения
          sessionStorage.removeItem("pendingOrder");
        } else {
          console.error("Failed to save order:", result.error);
        }
      } catch (err) {
        console.error("Error saving order:", err);
      } finally {
        setIsSavingOrder(false);
      }
    };

    saveOrder();
  }, [invoiceId, createOrder, orderSaved, isSavingOrder]);

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

        {invoiceId && (
          <p
            style={{
              fontSize: 14,
              color: c.lightText,
              margin: "8px 0 32px",
            }}
          >
            Номер транзакции: {invoiceId}
          </p>
        )}

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
