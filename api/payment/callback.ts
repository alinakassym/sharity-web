import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Инициализация Firebase Admin (только один раз)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

interface EpayCallbackData {
  invoiceId?: string;
  amount?: number;
  currency?: string;
  terminal?: string;
  status?: string; // Для платежей
  code?: string; // Для Card Verification (ok/error)
  accountId?: string; // Account ID для верификации карт
  // Поля для сохранённой карты (Card Verification)
  cardId?: string;
  cardMask?: string;
  cardType?: string;
  card_id?: string; // Альтернативные названия полей
  card_mask?: string;
  card_type?: string;
  // Добавьте другие поля согласно документации EPAY
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Разрешаем только POST запросы
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("=== EPAY CALLBACK START ===");
    console.log("EPAY callback received:", JSON.stringify(req.body, null, 2));
    console.log("EPAY callback - all keys:", Object.keys(req.body));
    console.log("Request headers:", JSON.stringify(req.headers, null, 2));

    const callbackData = req.body as EpayCallbackData;
    const { invoiceId, status, code, cardId, cardMask, cardType, card_id, card_mask, card_type, accountId } = callbackData;

    console.log("Card data in webhook:", {
      cardId: cardId || card_id,
      cardMask: cardMask || card_mask,
      cardType: cardType || card_type,
      accountId,
      status,
      code,
    });

    // Проверяем успешность:
    // - Для платежей: status === "success" или "APPROVED"
    // - Для Card Verification: code === "ok"
    const isPaymentSuccess = status === "success" || status === "APPROVED";
    const isCardVerificationSuccess = code === "ok";

    if (!isPaymentSuccess && !isCardVerificationSuccess) {
      console.log(`❌ Operation not successful. Status: ${status}, Code: ${code}`);
      return res.status(200).json({ message: "Operation not successful" });
    }

    console.log(`✅ Operation successful. Status: ${status}, Code: ${code}`);

    // Получаем данные из pendingOrders (если есть invoiceId)
    const pendingOrderRef = invoiceId ? db.collection("pendingOrders").doc(invoiceId) : null;
    const pendingOrderDoc = pendingOrderRef ? await pendingOrderRef.get() : null;

    // Если нет pendingOrder - это верификация карты
    if (!pendingOrderDoc || !pendingOrderDoc.exists) {
      console.log("No pending order found - treating as card verification");

      // Проверяем что есть данные карты
      const finalCardId = cardId || card_id;
      const finalCardMask = cardMask || card_mask;
      const finalCardType = cardType || card_type;

      if (!finalCardId || !finalCardMask || !finalCardType) {
        console.error("Card data missing in webhook");
        return res.status(400).json({ error: "Card data missing" });
      }

      if (!accountId) {
        console.error("Account ID missing in webhook");
        return res.status(400).json({ error: "Account ID missing" });
      }

      // Проверяем есть ли уже существующие карты пользователя
      const existingCardsQuery = await db
        .collection("savedCards")
        .where("userId", "==", accountId)
        .where("isDeleted", "==", false)
        .get();

      const isFirstCard = existingCardsQuery.empty;

      // Сохраняем карту в Firestore
      const cardDocId = `${accountId}_${finalCardId}`;
      await db.collection("savedCards").doc(cardDocId).set({
        userId: accountId,
        cardId: finalCardId,
        cardMask: finalCardMask,
        cardType: finalCardType,
        isDefault: isFirstCard, // Первая карта автоматически становится default
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      });

      console.log(`✅ Card ${cardDocId} saved successfully for user ${accountId}`);
      console.log("=== EPAY CALLBACK END (Card Verification) ===");

      return res.status(200).json({
        success: true,
        message: "Card saved successfully",
      });
    }

    const orderData = pendingOrderDoc.data();

    // Создаём заказ в orders
    const ordersRef = db.collection("orders");
    const newOrder = {
      ...orderData,
      invoiceId,
      status: "paid",
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const orderRef = await ordersRef.add(newOrder);
    console.log(`✅ Order created successfully: ${orderRef.id}`);
    console.log("=== EPAY CALLBACK END (Order Payment) ===");

    // Обновляем статус товара на "sold"
    if (orderData?.productId) {
      const productRef = db.collection("products").doc(orderData.productId);
      await productRef.update({
        status: "sold",
        updatedAt: new Date(),
      });
      console.log(`Product ${orderData.productId} marked as sold`);
    }

    // Удаляем запись из pendingOrders
    await pendingOrderRef.delete();
    console.log(`Pending order ${invoiceId} deleted`);

    return res.status(200).json({
      success: true,
      orderId: orderRef.id,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error processing EPAY callback:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
