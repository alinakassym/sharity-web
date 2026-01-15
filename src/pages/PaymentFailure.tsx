// src/pages/PaymentFailure.tsx

import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

type PendingOrder = {
  orderNumber?: string;
  totalAmount?: number;
  productName?: string;
  paymentStatus?: "paid" | "failed" | "pending";
};

const PaymentFailure: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const invoiceId = useMemo(() => {
    const value = searchParams.get("invoiceId");
    return value?.trim() || "";
  }, [searchParams]);

  const reason = useMemo(() => {
    // оставим поддержку старого параметра error
    return searchParams.get("reason") || searchParams.get("error") || "";
  }, [searchParams]);

  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!invoiceId) return;

      try {
        setLoading(true);
        setLoadError(null);

        const ref = doc(db, "pendingOrders", invoiceId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setPendingOrder(null);
          return;
        }

        setPendingOrder(snap.data() as PendingOrder);
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [invoiceId]);

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: 0 }}>Оплата не прошла</h2>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        <div>
          <b>invoiceId:</b> {invoiceId || "—"}
        </div>

        {pendingOrder?.orderNumber && (
          <div style={{ marginTop: 6 }}>
            <b>Номер заказа:</b> {pendingOrder.orderNumber}
          </div>
        )}

        {reason && (
          <div style={{ marginTop: 8, color: "#FF6B6B" }}>
            <b>Причина:</b> {reason}
          </div>
        )}

        {loading && <div style={{ marginTop: 8 }}>Проверяю данные…</div>}
        {loadError && (
          <div style={{ marginTop: 8, color: "#FF6B6B" }}>{loadError}</div>
        )}

        {!loading && !loadError && pendingOrder?.paymentStatus === "paid" && (
          <div style={{ marginTop: 8 }}>
            ⚠️ Интересно: в pendingOrders статус уже <b>paid</b>. Возможно,
            оплата прошла, но ты попала на failure по backLink. Проверь
            success-страницу.
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Назад
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            invoiceId
              ? navigate(`/payment?invoiceId=${invoiceId}`)
              : navigate("/")
          }
        >
          Попробовать снова
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailure;