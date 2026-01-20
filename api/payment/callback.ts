// api/payment/callback.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Firebase Admin init (один раз)
if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      "Missing Firebase Admin env vars: FIREBASE_PROJECT_ID / FIREBASE_ADMIN_CLIENT_EMAIL / FIREBASE_ADMIN_PRIVATE_KEY",
    );
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = getFirestore();

type PaymentStatus = "pending" | "paid" | "failed";

interface EpayCallbackData {
  // платеж
  invoiceId?: string; // иногда может прийти как invoiceID — проверим ниже тоже
  invoiceID?: string;
  amount?: number;
  currency?: string;
  terminal?: string;

  status?: string; // например "CHARGE"
  code?: string | number; // например 0
  reason?: string;
  reference?: string;

  // card verification
  accountId?: string;
  cardId?: string;
  cardMask?: string;
  cardType?: string;

  // альтернативные варианты полей (иногда так приходит)
  card_id?: string;
  card_mask?: string;
  card_type?: string;
}

const toUpper = (v: unknown) =>
  String(v ?? "")
    .trim()
    .toUpperCase();
const toLower = (v: unknown) =>
  String(v ?? "")
    .trim()
    .toLowerCase();

/**
 * Успешная операция по платежу в твоих данных:
 * status = "CHARGE"
 * code = 0
 */
const isSuccessfulPayment = (status: unknown, code: unknown): boolean => {
  const s = toUpper(status);
  const c = String(code ?? "").trim();

  // code 0/00 — success (встречается как number 0 или string "0")
  const codeOk = c === "0" || c === "00";

  // статусы успеха (под твою реальность)
  const statusOk = ["CHARGE", "APPROVED", "SUCCESS"].includes(s);

  return codeOk && statusOk;
};

const isSuccessfulCardVerification = (code: unknown): boolean => {
  // иногда приходит как "ok"
  return toLower(code) === "ok";
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  console.log("CALLBACK HIT", new Date().toISOString());

  try {
    const callbackData = (req.body || {}) as EpayCallbackData;

    const invoiceId =
      String(callbackData.invoiceId || callbackData.invoiceID || "").trim() ||
      undefined;

    const status = callbackData.status;
    const code = callbackData.code;

    console.log("=== EPAY CALLBACK START ===");
    console.log("invoiceId:", invoiceId);
    console.log("status:", status, "code:", code);
    console.log("body keys:", Object.keys(callbackData));

    const paymentSuccess = isSuccessfulPayment(status, code);
    const cardVerificationSuccess = isSuccessfulCardVerification(code);
    const isSuccess = paymentSuccess || cardVerificationSuccess;

    // --- ВЕТКА: НЕУСПЕХ ---
    if (!isSuccess) {
      console.log(`❌ Operation not successful. status=${status} code=${code}`);

      if (invoiceId) {
        const pendingRef = db.collection("pendingOrders").doc(invoiceId);
        const pendingSnap = await pendingRef.get();

        if (pendingSnap.exists) {
          await pendingRef.set(
            {
              paymentStatus: "failed" as PaymentStatus,
              paymentError: {
                status: status ?? null,
                code: code ?? null,
                reason: callbackData.reason ?? null,
              },
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true },
          );

          console.log(`Pending order ${invoiceId} marked as failed`);
        } else {
          console.log(
            `Pending order ${invoiceId} not found. Nothing to mark as failed.`,
          );
        }
      }

      // ePay обычно ожидает 200, чтобы не ретраить бесконечно
      console.log("=== EPAY CALLBACK END (FAILED) ===");
      return res
        .status(200)
        .json({ success: false, message: "Not successful" });
    }

    console.log(`✅ Operation successful. status=${status} code=${code}`);

    // --- Пытаемся понять: это платеж или верификация карты ---
    const pendingRef = invoiceId
      ? db.collection("pendingOrders").doc(invoiceId)
      : null;
    const pendingSnap = pendingRef ? await pendingRef.get() : null;

    // --- ВЕТКА: CARD VERIFICATION (если pendingOrder не найден) ---
    if (!pendingSnap || !pendingSnap.exists) {
      console.log("No pending order found -> treating as card verification");

      const accountId = callbackData.accountId;
      const finalCardId = callbackData.cardId || callbackData.card_id;
      const finalCardMask = callbackData.cardMask || callbackData.card_mask;
      const finalCardType = callbackData.cardType || callbackData.card_type;

      if (!accountId) {
        return res.status(400).json({ error: "Account ID missing" });
      }
      if (!finalCardId || !finalCardMask || !finalCardType) {
        return res.status(400).json({ error: "Card data missing" });
      }

      // первая карта будет default
      const existingCardsQuery = await db
        .collection("savedCards")
        .where("userId", "==", accountId)
        .where("isDeleted", "==", false)
        .get();

      const isFirstCard = existingCardsQuery.empty;

      const cardDocId = `${accountId}_${finalCardId}`;

      await db.collection("savedCards").doc(cardDocId).set(
        {
          userId: accountId,
          cardId: finalCardId,
          cardMask: finalCardMask,
          cardType: finalCardType,
          isDefault: isFirstCard,
          isDeleted: false,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      console.log(`✅ Card saved: ${cardDocId}`);
      console.log("=== EPAY CALLBACK END (CARD VERIFICATION) ===");
      return res.status(200).json({ success: true, message: "Card saved" });
    }

    // --- ВЕТКА: PAYMENT (pendingOrder найден) ---
    const pendingData = pendingSnap.data() || {};
    const existingPaymentStatus = pendingData.paymentStatus as
      | PaymentStatus
      | undefined;
    const existingOrderId = pendingData.orderId as string | undefined;

    // Идемпотентность: если уже paid и есть orderId — ничего не создаём повторно
    if (existingPaymentStatus === "paid" && existingOrderId) {
      console.log(
        `✅ Already paid. invoiceId=${invoiceId} orderId=${existingOrderId}`,
      );
      console.log("=== EPAY CALLBACK END (IDEMPOTENT) ===");
      return res.status(200).json({
        success: true,
        message: "Already processed",
        orderId: existingOrderId,
      });
    }

    // Создаем заказ
    const ordersRef = db.collection("orders");

    const newOrder = {
      ...pendingData,
      invoiceId,
      paymentStatus: "paid",
      isDeleted: false,
      // можно хранить платежные метаданные
      epay: {
        status: status ?? null,
        code: code ?? null,
        reference: callbackData.reference ?? null,
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const orderRef = await ordersRef.add(newOrder);

    console.log(`✅ Order created: ${orderRef.id}`);

    // Обновляем pendingOrders: ставим paid и сохраняем orderId (НЕ УДАЛЯЕМ)
    await pendingRef!.set(
      {
        paymentStatus: "paid" as PaymentStatus,
        orderId: orderRef.id,
        paidAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    console.log(`Pending order ${invoiceId} marked as paid`);

    // Обновляем товар как sold (если есть productId)
    const productId = pendingData.productId as string | undefined;
    if (productId) {
      await db.collection("products").doc(productId).set(
        {
          status: "sold",
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      console.log(`Product ${productId} marked as sold`);
    }

    console.log("=== EPAY CALLBACK END (PAYMENT) ===");
    return res.status(200).json({
      success: true,
      orderId: orderRef.id,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error processing EPAY callback:", error);

    // Обычно ePay лучше отдавать 200, чтобы не ретраило бесконечно,
    // но если тебе важнее видеть 500 — можешь оставить 500.
    return res.status(200).json({
      success: false,
      message: "Internal error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
