import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type DeliveryAddress } from "./useRequestCreateOrder";

export interface OrderFromDB {
  id: string;
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
  amount: number;
  deliveryFee: number;
  totalAmount: number;

  // Информация о покупателе
  buyerId: string; // ID пользователя в Firebase (users collection)
  buyerTelegramId?: number; // Telegram ID пользователя
  buyerUsername?: string; // Telegram username
  buyerName?: string; // Имя покупателя

  // Статус заказа
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  // Флаг удаления (для soft delete)
  isDeleted?: boolean;

  // Временные метки
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

export const useRequestGetOrders = (buyerId?: string) => {
  const [orders, setOrders] = useState<OrderFromDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!buyerId) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const col = collection(db, "orders");
    const q = query(
      col,
      where("buyerId", "==", buyerId),
      where("isDeleted", "==", false), // Показываем только не удалённые заказы
      orderBy("createdAt", "desc"), // Сортировка по дате создания (новые сверху)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as OrderFromDB,
        );
        setOrders(arr);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching orders:", err);
        setIsLoading(false);
      },
    );

    return unsub;
  }, [buyerId]);

  return { orders, isLoading };
};
