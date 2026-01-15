import { useEffect } from "react";
import type { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import Container from "@/components/Container";

const PaymentFailure: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const [searchParams] = useSearchParams();

  // Получаем параметры из URL (переданные от EPAY)
  const invoiceId = searchParams.get("invoiceId");
  const error = searchParams.get("error");

  useEffect(() => {
    // Здесь можно сохранить информацию о неуспешной транзакции
    console.log("Payment failed:", { invoiceId, error });
  }, [invoiceId, error]);

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
        {/* Error icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "#FF6B6B20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <VuesaxIcon name="close-circle" size={48} color="#FF6B6B" />
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: c.text,
            margin: "0 0 12px",
          }}
        >
          Оплата не удалась
        </h1>

        <p
          style={{
            fontSize: 16,
            color: c.lightText,
            margin: "0 0 8px",
            lineHeight: 1.5,
          }}
        >
          К сожалению, произошла ошибка при обработке платежа.
        </p>

        {error && (
          <p
            style={{
              fontSize: 14,
              color: "#FF6B6B",
              margin: "8px 0 32px",
            }}
          >
            {error}
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
            onClick={() => navigate(-1)}
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
            Попробовать снова
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

export default PaymentFailure;
