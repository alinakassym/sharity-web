import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface DeliveryAddress {
  city: string;
  street: string;
  building: string;
  apartment?: string;
  phone: string;
}

export interface CreateOrderData {
  // Информация о товаре
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productCategory: string;

  // Информация о доставке
  deliveryAddress: DeliveryAddress;

  // Информация об оплате
  orderNumber: string; // Читаемый номер заказа (например: 251216-88799)
  invoiceId: string; // ID транзакции от платежной системы
  amount: number; // Цена товара
  deliveryFee: number;
  totalAmount: number; // amount + deliveryFee

  // Информация о покупателе
  buyerId: string; // ID пользователя в Firebase (users collection)
  buyerTelegramId?: number; // Telegram ID пользователя
  buyerUsername?: string; // Telegram username
  buyerName?: string; // Имя покупателя

  // Статус заказа
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

  // Флаг удаления (для soft delete)
  isDeleted?: boolean;

  // Временные метки
  createdAt?: Date;
  updatedAt?: Date;
}

export const useRequestCreateOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createOrder = async (orderData: CreateOrderData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // Добавляем timestamp создания и устанавливаем isDeleted = false
      const dataToSave = {
        ...orderData,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const col = collection(db, "orders");
      const docRef = await addDoc(col, dataToSave);

      setSuccess(true);
      setIsLoading(false);

      return { success: true, id: docRef.id };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при создании заказа";
      setError(errorMessage);
      setIsLoading(false);

      return { success: false, error: errorMessage };
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    createOrder,
    isLoading,
    error,
    success,
    resetState,
  };
};
