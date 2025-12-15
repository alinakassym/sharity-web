import { useEffect } from "react";
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

  // Получаем параметры из URL (переданные от EPAY)
  const invoiceId = searchParams.get("invoiceId");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Здесь можно сохранить информацию о транзакции в Firebase
    console.log("Payment successful:", { invoiceId, orderId });
  }, [invoiceId, orderId]);

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
