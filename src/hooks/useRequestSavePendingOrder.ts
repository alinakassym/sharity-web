import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface PendingOrderData {
  // Информация о товаре
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productCategory: string;

  // Информация о доставке
  deliveryAddress: {
    city: string;
    street: string;
    building: string;
    apartment?: string;
    phone: string;
  };

  // Информация об оплате
  orderNumber: string;
  amount: number;
  deliveryFee: number;
  totalAmount: number;

  // Информация о покупателе
  buyerId: string;
  buyerTelegramId?: number;
  buyerUsername?: string;
  buyerName?: string;
}

export const useRequestSavePendingOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePendingOrder = async (
    invoiceId: string,
    orderData: PendingOrderData
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // Сохраняем в Firestore с invoiceId в качестве document ID
      const pendingOrderRef = doc(db, "pendingOrders", invoiceId);
      await setDoc(pendingOrderRef, {
        ...orderData,
        createdAt: new Date(),
      });

      setIsLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при сохранении заказа";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    savePendingOrder,
    isLoading,
    error,
  };
};
