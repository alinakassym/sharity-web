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
  invoiceId: string;
  amount: number;
  currency: string;
  terminal: string;
  status: string;
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
    console.log("EPAY callback received:", JSON.stringify(req.body, null, 2));
    console.log("EPAY callback - all keys:", Object.keys(req.body));

    const callbackData = req.body as EpayCallbackData;
    const { invoiceId, status, cardId, cardMask, cardType, card_id, card_mask, card_type } = callbackData;

    console.log("Card data in webhook:", {
      cardId: cardId || card_id,
      cardMask: cardMask || card_mask,
      cardType: cardType || card_type,
    });

    // Проверяем, что платёж успешен
    if (status !== "success" && status !== "APPROVED") {
      console.log(`Payment not successful. Status: ${status}`);
      return res.status(200).json({ message: "Payment not successful" });
    }

    // Получаем данные из pendingOrders
    const pendingOrderRef = db.collection("pendingOrders").doc(invoiceId);
    const pendingOrderDoc = await pendingOrderRef.get();

    if (!pendingOrderDoc.exists) {
      console.error(`Pending order not found for invoiceId: ${invoiceId}`);
      return res.status(404).json({ error: "Pending order not found" });
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
    console.log(`Order created successfully: ${orderRef.id}`);

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
