// src/types/cards.ts

import type { Timestamp } from "firebase/firestore";

export interface SavedCard {
  id: string; // document ID из Firestore
  userId: string; // telegramId пользователя
  cardId: string; // ID карты от ePay
  cardMask: string; // Маска карты (например "440564******4242")
  cardType: string; // Тип карты (VISA, MASTERCARD, etc.)
  isDefault: boolean; // Карта по умолчанию
  createdAt: Date | Timestamp; // Дата добавления
  updatedAt: Date | Timestamp; // Дата последнего обновления
  isDeleted?: boolean; // Софт-удаление (для истории)
}

export interface CardVerificationParams {
  amount: number; // Всегда 0 для верификации
  currency: string; // "KZT" для верификации
  cardSave: boolean; // Всегда true для сохранения
  accountId: string; // userId (обязательный)
  description: string;
}

export interface CardVerificationResult {
  success: boolean;
  cardId?: string; // ID сохранённой карты от ePay
  cardMask?: string; // Маска карты
  cardType?: string; // Тип карты
  message?: string; // Сообщение об ошибке
  data?: unknown; // Полные данные ответа
}
