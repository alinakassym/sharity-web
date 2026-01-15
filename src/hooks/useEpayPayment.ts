// src/hooks/useEpayPayment.ts

import { useState, useCallback } from "react";
import { completeOrderFromPending } from "@/lib/orders";

// EPAY Configuration (тестовая среда)
const EPAY_CONFIG = {
  tokenEndpoint: "https://test-epay-oauth.epayment.kz/oauth2/token",
  paymentLibUrl: "https://test-epay.epayment.kz/payform/payment-api.js",
  scope:
    "webapi usermanagement email_send verification statement statistics payment",
  clientId: "test",
  clientSecret: "yF587AV9Ms94qN2QShFzVR3vFnWkhjbAK3sG",
  terminal: "67e34d63-102f-4bd1-898e-370781d0074d",
  currency: "KZT",
};

interface PaymentParams {
  amount: number;
  description: string;
  invoiceId?: string;
  accountId?: string;
  payerName?: string;
  cardSave?: boolean; // Флаг сохранения карты (для Card Verification)
  currency?: string; // Валюта (USD для верификации, KZT для оплаты)
}

interface PaymentResult {
  success: boolean;
  message?: string;
  data?: unknown;
  invoiceId?: string; // Added invoiceId as an optional property
  cardId?: string; // ID сохранённой карты (для Card Verification)
  cardMask?: string; // Маска карты (для Card Verification)
  cardType?: string; // Тип карты (для Card Verification)
}

interface EpayToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface CardVerificationParams {
  accountId: string;
  payerName?: string;
}

interface CardVerificationResult {
  success: boolean;
  cardId?: string;
  cardMask?: string;
  cardType?: string;
  message?: string;
}

declare global {
  interface Window {
    halyk?: {
      showPaymentWidget: (
        params: Record<string, unknown>,
        callback: (result: unknown) => void,
      ) => void;
      cardverification: (
        params: Record<string, unknown>,
        callback: (result: unknown) => void,
      ) => void;
    };
  }
}

export const useEpayPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка библиотеки EPAY
  const loadPaymentLib = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.halyk?.showPaymentWidget) {
        resolve();
        return;
      }

      const existingScript = document.getElementById("epay-payment-lib");
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), {
          once: true,
        });
        existingScript.addEventListener(
          "error",
          () => reject(new Error("Failed to load EPAY library")),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.id = "epay-payment-lib";
      script.src = EPAY_CONFIG.paymentLibUrl;
      script.onload = () => {
        // Добавляем стили для виджета после загрузки
        injectWidgetStyles();
        resolve();
      };
      script.onerror = () => reject(new Error("Failed to load EPAY library"));
      document.body.appendChild(script);
    });
  }, []);

  // Функция для добавления кастомных стилей виджета
  const injectWidgetStyles = () => {
    const existingStyle = document.getElementById("epay-widget-styles");
    if (existingStyle) return;

    const style = document.createElement("style");
    style.id = "epay-widget-styles";
    style.textContent = `
      /* Стили для EPAY виджета */
      #epay-widget-container {
        position: fixed !important;
        top: 120px;
        left: 0;
        max-width: 500px !important;
        max-height: 80vh !important;
        margin-top: 0 !important;
      },
      #halyk-payment-widget {
        position: fixed !important;
        top: 120px;
        left: 0;
        max-width: 500px !important;
        max-height: 80vh !important;
        margin-top: 0 !important;
      }

      /* Если виджет использует iframe */
      iframe[src*="epay"] {
        position: fixed !important;
        top: 120px;
        left: 0;
        max-width: 500px !important;
        max-height: 80vh !important;
        margin-top: 0 !important;
        border-radius: 12px !important;
      },
      iframe[src*="halyk"] {
        position: fixed !important;
        top: 120px;
        left: 0;
        max-width: 500px !important;
        max-height: 80vh !important;
        margin-top: 0 !important;
        border-radius: 12px !important;
      }

      /* Overlay/backdrop */
      .epay-overlay: {
        position: fixed !important;
        top: 120px;
        left: 0;
      },
      .halyk-overlay {
        position: fixed !important;
        top: 120px;
        left: 0;
        background: rgba(0, 0, 0, 0.7) !important;
      }

      /* Адаптивность для мобильных */
      @media (max-width: 768px) {
        #epay-widget-container iframe[src*="halyk"] {
          position: fixed !important;
          top: 120px;
        left: 0;
          padding-top: 100px !important;
          Coumargin-top: 0 !important;rseGrid
          max-width: 95vw !important;
          max-height: 80vh !important;
        },
        #halyk-payment-widget iframe[src*="halyk"] {
          position: fixed !important;
          top: 120px;
        left: 0;
          padding-top: 100px !important;
          Coumargin-top: 0 !important;rseGrid
          max-width: 95vw !important;
          max-height: 80vh !important;
        },
        iframe[src*="epay"] iframe[src*="halyk"] {
          position: fixed !important;
          top: 120px;
        left: 0;
          padding-top: 100px !important;
          Coumargin-top: 0 !important;rseGrid
          max-width: 95vw !important;
          max-height: 80vh !important;
        },
        iframe[src*="halyk"] {
          position: fixed !important;
          top: 120px;
        left: 0;
          padding-top: 100px !important;
          Coumargin-top: 0 !important;rseGrid
          max-width: 95vw !important;
          max-height: 80vh !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Получение OAuth токена
  const getToken = useCallback(
    async (
      invoiceId: string,
      amount: number,
      secretHash: string,
      currency: string, // Добавлен параметр currency
    ): Promise<EpayToken> => {
      const formData = new URLSearchParams();
      formData.set("grant_type", "client_credentials");
      formData.set("scope", EPAY_CONFIG.scope);
      formData.set("client_id", EPAY_CONFIG.clientId);
      formData.set("client_secret", EPAY_CONFIG.clientSecret);
      formData.set("invoiceID", invoiceId);
      formData.set("secret_hash", secretHash);
      formData.set("amount", amount.toString());
      formData.set("currency", currency); // Используем переданную валюту
      formData.set("terminal", EPAY_CONFIG.terminal);

      const response = await fetch(EPAY_CONFIG.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Token request failed: ${response.status} ${JSON.stringify(errorData)}`,
        );
      }

      return response.json();
    },
    [],
  );

  // Инициация платежа
  const initiatePayment = useCallback(
    async (params: PaymentParams): Promise<PaymentResult> => {
      setIsLoading(true);
      setError(null);

      try {
        // Генерируем уникальный invoiceId (такой же формат как в демо)
        const invoiceId = params.invoiceId || `${Date.now()}`.slice(-12);
        const secretHash = "DEMO_HASH";

        // Определяем валюту (переданная или дефолтная)
        const currency = params.currency || EPAY_CONFIG.currency;

        // Получаем токен с той же валютой, что и платёж
        const token = await getToken(
          invoiceId,
          params.amount,
          secretHash,
          currency,
        );

        // Загружаем библиотеку
        await loadPaymentLib();

        // Формируем параметры для виджета
        const paymentObject = {
          invoiceId,
          invoiceIdAlt: invoiceId,
          backLink: `${window.location.origin}/payment/success`,
          failureBackLink: `${window.location.origin}/payment/failure`,
          postLink: `${window.location.origin}/api/payment/callback`, // Webhook для успешной оплаты
          failurePostLink: `${window.location.origin}/api/payment/callback`, // Тот же endpoint обработает ошибки
          language: "RUS",
          description: params.description,
          accountId: params.accountId || "guest",
          terminal: EPAY_CONFIG.terminal,
          amount: params.amount,
          name: params.payerName || "Покупатель",
          currency, // Используем переданную или дефолтную валюту
          cardSave: params.cardSave || false, // Флаг сохранения карты
          data: JSON.stringify({
            statement: {
              name: params.payerName || "Покупатель",
              invoiceID: invoiceId,
            },
          }),
          recurrent: true,
          auth: token,
        };

        // Открываем виджет
        return new Promise((resolve) => {
          if (!window.halyk) {
            resolve({
              success: false,
              message: "Payment library not loaded",
            });
            return;
          }

          window.halyk.showPaymentWidget(paymentObject, async (result) => {
            console.log("Payment widget callback:", result);
            console.log(
              "Payment widget callback - full result stringified:",
              JSON.stringify(result, null, 2),
            );

            // Проверяем результат оплаты
            // EPAY виджет может вернуть разные форматы результата:
            // - { success: true } или { success: false }
            // - { status: "success" } или { status: "error" }
            let paymentSuccess = false;

            if (result && typeof result === "object") {
              const resultObj = result as Record<string, unknown>;

              // Проверяем поле success
              if ("success" in resultObj) {
                paymentSuccess = resultObj.success === true;
              }
              // Или проверяем поле status
              else if ("status" in resultObj) {
                paymentSuccess =
                  resultObj.status === "success" ||
                  resultObj.status === "APPROVED";
              }
            }

            // Извлекаем данные карты из результата (для Card Verification)
            const resultObj = result as Record<string, unknown>;
            console.log("Extracting card data from result...");
            console.log("cardId:", resultObj.cardId);
            console.log("cardMask:", resultObj.cardMask);
            console.log("cardType:", resultObj.cardType);
            console.log("All keys in result:", Object.keys(resultObj));

            const cardId = resultObj.cardId as string | undefined;
            const cardMask = resultObj.cardMask as string | undefined;
            const cardType = resultObj.cardType as string | undefined;

            if (paymentSuccess) {
              // Если это обычный платёж (не сохранение карты) - создаём заказ
              if (!params.cardSave) {
                console.log(
                  "Payment successful, creating order immediately...",
                );
                try {
                  const orderResult = await completeOrderFromPending(invoiceId);
                  if (orderResult.success) {
                    console.log(
                      `Order created successfully: ${orderResult.orderId}`,
                    );
                  } else {
                    console.error(
                      `Failed to create order: ${orderResult.error}`,
                    );
                  }
                } catch (err) {
                  console.error("Error creating order:", err);
                }
              } else {
                // Это Card Verification - логируем данные карты
                console.log("Card verification successful:", {
                  cardId,
                  cardMask,
                  cardType,
                });
              }
            } else {
              console.log("Payment was not successful, order not created");
            }

            setIsLoading(false);
            resolve({
              success: paymentSuccess,
              data: result,
              invoiceId,
              cardId, // Пробрасываем данные карты
              cardMask,
              cardType,
            });
          });
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Payment initialization failed";
        console.error("Payment error:", err);
        setError(errorMessage);
        setIsLoading(false);
        return {
          success: false,
          message: errorMessage,
        };
      }
    },
    [getToken, loadPaymentLib],
  );

  // Верификация карты (Card Verification)
  const verifyCard = useCallback(
    async (params: CardVerificationParams): Promise<CardVerificationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        // Генерируем уникальный invoiceId
        const invoiceId = `${Date.now()}`.slice(-12);
        const secretHash = "DEMO_HASH";
        const amount = 10; // Минимальная сумма для верификации карты (10 KZT)
        const currency = "KZT"; // Для Card Verification всегда KZT согласно документации ePay

        // Получаем токен для верификации
        const token = await getToken(invoiceId, amount, secretHash, currency);

        // Загружаем библиотеку
        await loadPaymentLib();

        // Формируем параметры для виджета (используем тот же showPaymentWidget)
        const verificationObject = {
          invoiceId,
          invoiceIdAlt: invoiceId,
          backLink:
            window.location.origin +
            window.location.pathname.replace(
              /\/add-card.*/,
              "/payment-methods",
            ),
          failureBackLink:
            window.location.origin +
            window.location.pathname.replace(
              /\/add-card.*/,
              "/payment-methods",
            ),
          postLink: `${window.location.origin}/api/payment/callback`,
          failurePostLink: `${window.location.origin}/api/payment/callback`,
          language: "RUS",
          description: "Верификация платёжной карты",
          accountId: params.accountId,
          terminal: EPAY_CONFIG.terminal,
          amount,
          currency,
          cardSave: true, // Ключевой флаг для сохранения карты
          name: params.payerName || "Покупатель",
          data: JSON.stringify({
            statement: {
              name: params.payerName || "Покупатель",
              invoiceID: invoiceId,
            },
          }),
          recurrent: true,
          auth: token,
        };

        // Открываем виджет (используем showPaymentWidget как в initiatePayment)
        return new Promise((resolve) => {
          if (!window.halyk) {
            resolve({
              success: false,
              message: "Payment library not loaded",
            });
            return;
          }

          window.halyk.showPaymentWidget(verificationObject, (result) => {
            console.log("Card verification widget callback:", result);
            console.log(
              "Card verification widget callback - full result:",
              JSON.stringify(result, null, 2),
            );

            // Проверяем результат верификации (аналогично initiatePayment)
            let verificationSuccess = false;

            if (result && typeof result === "object") {
              const resultObj = result as Record<string, unknown>;

              // Проверяем поле success
              if ("success" in resultObj) {
                verificationSuccess = resultObj.success === true;
              }
              // Или проверяем поле status
              else if ("status" in resultObj) {
                verificationSuccess =
                  resultObj.status === "success" ||
                  resultObj.status === "APPROVED";
              }
            }

            // Извлекаем данные карты из результата
            const resultObj = result as Record<string, unknown>;
            console.log("Extracting card data from verification result...");
            console.log("cardId:", resultObj.cardId);
            console.log("cardMask:", resultObj.cardMask);
            console.log("cardType:", resultObj.cardType);
            console.log("All keys in result:", Object.keys(resultObj));

            const cardId = resultObj.cardId as string | undefined;
            const cardMask = resultObj.cardMask as string | undefined;
            const cardType = resultObj.cardType as string | undefined;

            if (verificationSuccess && cardId) {
              console.log("Card verification successful:", {
                cardId,
                cardMask,
                cardType,
              });
              setIsLoading(false);
              resolve({
                success: true,
                cardId,
                cardMask,
                cardType,
              });
            } else {
              const message = resultObj.message as string | undefined;
              console.error(
                "Card verification failed:",
                message || "Unknown error",
              );
              setIsLoading(false);
              resolve({
                success: false,
                message: message || "Card verification failed",
              });
            }
          });
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Card verification failed";
        console.error("Card verification error:", err);
        setError(errorMessage);
        setIsLoading(false);
        return {
          success: false,
          message: errorMessage,
        };
      }
    },
    [getToken, loadPaymentLib],
  );

  return {
    initiatePayment,
    verifyCard,
    isLoading,
    error,
  };
};
