// src/pages/PaymentSuccess.tsx

import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

type PendingOrder = {
  orderNumber?: string;
  totalAmount?: number;
  productName?: string;
  paymentStatus?: "paid" | "failed" | "pending";
};

const PaymentSuccess: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const invoiceId = useMemo(() => {
    const value = searchParams.get("invoiceId");
    return value?.trim() || "";
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
          setLoadError("pendingOrder не найден по invoiceId");
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

  const orderNumber = pendingOrder?.orderNumber || "—";
  const status = pendingOrder?.paymentStatus;

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: 0 }}>Оплата завершена</h2>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        <div>
          <b>invoiceId:</b> {invoiceId || "—"}
        </div>
        <div style={{ marginTop: 6 }}>
          <b>Номер заказа:</b> {orderNumber}
        </div>

        {loading && <div style={{ marginTop: 8 }}>Проверяю статус…</div>}

        {loadError && (
          <div style={{ marginTop: 8, color: "#FF6B6B" }}>{loadError}</div>
        )}

        {!loading && !loadError && (
          <div style={{ marginTop: 8 }}>
            {status === "paid" && <div>✅ Оплата подтверждена. Спасибо!</div>}

            {status === "failed" && (
              <div>⚠️ Оплата отмечена как неуспешная.</div>
            )}

            {!status || status === "pending" ? (
              <div>
                ⏳ Оплата ещё не подтверждена сервером. Если ты только что
                оплатила — подожди пару секунд и обнови страницу.
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          На главную
        </Button>

        <Button variant="contained" onClick={() => window.location.reload()}>
          Обновить статус
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
