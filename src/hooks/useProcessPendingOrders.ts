import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRequestCreateOrder } from "./useRequestCreateOrder";
import { useRequestUpdateProduct } from "./useRequestUpdateProduct";

/**
 * Хук для обработки незавершённых заказов из pendingOrders
 * Автоматически завершает заказы старше 30 секунд
 */
export const useProcessPendingOrders = (userId?: string) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createOrder } = useRequestCreateOrder();
  const { updateProduct } = useRequestUpdateProduct();

  useEffect(() => {
    if (!userId) return;

    const processPendingOrders = async () => {
      try {
        setIsProcessing(true);

        // Получаем все pending orders для этого пользователя старше 30 секунд
        const pendingOrdersRef = collection(db, "pendingOrders");
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);

        const q = query(
          pendingOrdersRef,
          where("buyerId", "==", userId),
          where("createdAt", "<=", Timestamp.fromDate(thirtySecondsAgo))
        );

        const snapshot = await getDocs(q);

        console.log(
          `Found ${snapshot.docs.length} pending orders to process for user ${userId}`
        );

        // Обрабатываем каждый pending order
        for (const pendingDoc of snapshot.docs) {
          const invoiceId = pendingDoc.id;
          const orderData = pendingDoc.data();

          console.log(`Processing pending order ${invoiceId}...`);

          try {
            // Создаём заказ (приводим orderData к правильному типу)
            const result = await createOrder({
              productId: orderData.productId,
              productName: orderData.productName,
              productPrice: orderData.productPrice,
              productImage: orderData.productImage,
              productCategory: orderData.productCategory,
              deliveryAddress: orderData.deliveryAddress,
              orderNumber: orderData.orderNumber,
              amount: orderData.amount,
              deliveryFee: orderData.deliveryFee,
              totalAmount: orderData.totalAmount,
              buyerId: orderData.buyerId,
              buyerTelegramId: orderData.buyerTelegramId,
              buyerUsername: orderData.buyerUsername,
              buyerName: orderData.buyerName,
              invoiceId,
              status: "paid" as const,
            });

            if (result.success) {
              console.log(`Order created: ${result.id}`);

              // Обновляем статус товара
              if (orderData.productId) {
                await updateProduct(orderData.productId, { status: "sold" });
                console.log(`Product ${orderData.productId} marked as sold`);
              }

              // Удаляем из pendingOrders
              await deleteDoc(doc(db, "pendingOrders", invoiceId));
              console.log(`Pending order ${invoiceId} deleted`);
            }
          } catch (err) {
            console.error(`Error processing pending order ${invoiceId}:`, err);
          }
        }
      } catch (err) {
        console.error("Error processing pending orders:", err);
      } finally {
        setIsProcessing(false);
      }
    };

    // Запускаем обработку через 2 секунды после монтирования
    const timer = setTimeout(() => {
      processPendingOrders();
    }, 2000);

    return () => clearTimeout(timer);
  }, [userId, createOrder, updateProduct]);

  return { isProcessing };
};
