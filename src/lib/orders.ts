import { collection, addDoc, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Генерирует читаемый номер заказа в формате YYMMDD-XXXXX
 * Например: 251216-88799
 *
 * @returns Уникальный номер заказа
 */
export const generateOrderNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const timestamp = Date.now().toString();
  const uniqueId = timestamp.slice(-5); // последние 5 цифр timestamp

  return `${year}${month}${day}-${uniqueId}`;
};

/**
 * Создаёт заказ из pending order и обновляет статус товара
 * Можно вызывать откуда угодно (не требует React hooks)
 */
export const completeOrderFromPending = async (invoiceId: string) => {
  try {
    console.log(`Completing order for invoiceId: ${invoiceId}`);

    // Получаем данные из pendingOrders
    const pendingOrderRef = doc(db, "pendingOrders", invoiceId);
    const pendingOrderSnap = await getDoc(pendingOrderRef);

    if (!pendingOrderSnap.exists()) {
      console.error(`Pending order not found: ${invoiceId}`);
      return { success: false, error: "Pending order not found" };
    }

    const orderData = pendingOrderSnap.data();

    // Создаём заказ в orders
    const ordersRef = collection(db, "orders");
    const newOrder = {
      ...orderData,
      invoiceId,
      status: "paid",
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const orderRef = await addDoc(ordersRef, newOrder);
    console.log(`Order created: ${orderRef.id}`);

    // Обновляем статус товара на "sold"
    if (orderData.productId) {
      const productRef = doc(db, "products", orderData.productId);
      await updateDoc(productRef, {
        status: "sold",
        updatedAt: new Date(),
      });
      console.log(`Product ${orderData.productId} marked as sold`);
    }

    // Удаляем pendingOrder после успешного создания заказа
    await deleteDoc(pendingOrderRef);
    console.log(`Pending order ${invoiceId} deleted`);

    return { success: true, orderId: orderRef.id };
  } catch (error) {
    console.error("Error completing order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
