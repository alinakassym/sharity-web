// src/pages/PaymentWidget.tsx

import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useEpayPayment } from "@/hooks/useEpayPayment";

type PendingOrder = {
  productName?: string;
  totalAmount?: number;
  buyerId?: string;
  buyerName?: string;
  buyerTelegramId?: number;
};

const PaymentWidget: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const invoiceId = useMemo(() => {
    const value = searchParams.get("invoiceId");
    return value?.trim() || "";
  }, [searchParams]);

  const { initiatePayment, isLoading, error } = useEpayPayment();

  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
  const [isPendingLoading, setIsPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!invoiceId) return;

      try {
        setIsPendingLoading(true);
        setPendingError(null);

        const ref = doc(db, "pendingOrders", invoiceId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setPendingOrder(null);
          setPendingError(
            "pendingOrder не найден (возможно, неверный invoiceId).",
          );
          return;
        }

        setPendingOrder(snap.data() as PendingOrder);
      } catch (e) {
        setPendingError(
          e instanceof Error ? e.message : "Ошибка загрузки pendingOrder",
        );
      } finally {
        setIsPendingLoading(false);
      }
    };

    void load();
  }, [invoiceId]);

  const totalAmount = pendingOrder?.totalAmount ?? 0;
  const productName = pendingOrder?.productName ?? "Покупка";

  const handleStartPayment = useCallback(async () => {
    if (!invoiceId) return;

    const result = await initiatePayment({
      amount: totalAmount,
      description: `Покупка: ${productName}`,
      invoiceId,
      accountId: pendingOrder?.buyerId || "guest",
      payerName: pendingOrder?.buyerName || "Покупатель",
    });

    // На всякий случай: если виджет вернул success — ведём на success
    // (иногда backLink сам отрабатывает, но это поведение зависит от виджета)
    if (result.success) {
      navigate(`/payment/success?invoiceId=${invoiceId}`);
    }
  }, [
    initiatePayment,
    invoiceId,
    navigate,
    pendingOrder?.buyerId,
    pendingOrder?.buyerName,
    productName,
    totalAmount,
  ]);

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: 0 }}>Оплата</h2>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        <div>
          <b>invoiceId:</b> {invoiceId || "—"}
        </div>

        {isPendingLoading && (
          <div style={{ marginTop: 8 }}>Загружаю заказ…</div>
        )}

        {pendingError && (
          <div style={{ marginTop: 8, color: "#FF6B6B" }}>{pendingError}</div>
        )}

        {pendingOrder && (
          <div style={{ marginTop: 8 }}>
            <div>
              <b>Товар:</b> {productName}
            </div>
            <div>
              <b>Сумма:</b> {totalAmount} ₸
            </div>
          </div>
        )}

        {error && <div style={{ marginTop: 8, color: "#FF6B6B" }}>{error}</div>}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          disabled={isLoading}
        >
          Назад
        </Button>

        <Button
          variant="contained"
          onClick={handleStartPayment}
          disabled={
            !invoiceId || !pendingOrder || isPendingLoading || isLoading
          }
        >
          {isLoading ? "Открываю оплату…" : "Оплатить"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentWidget;
