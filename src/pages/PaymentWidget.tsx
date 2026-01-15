// src/pages/PaymentWidget.tsx

import type { FC } from "react";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";

const PaymentWidget: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const invoiceId = useMemo(() => {
    const value = searchParams.get("invoiceId");
    return value?.trim() || "";
  }, [searchParams]);

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: 0 }}>Оплата</h2>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        <div>
          <b>invoiceId:</b> {invoiceId || "—"}
        </div>

        {!invoiceId && (
          <div style={{ marginTop: 8 }}>
            Нет invoiceId. Вернись в Checkout и попробуй снова.
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>

      {/* На следующем шаге сюда добавим запуск виджета */}
    </div>
  );
};

export default PaymentWidget;
