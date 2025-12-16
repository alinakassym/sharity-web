// sharity-web/src/hooks/useEpayPayment.ts

import { useState, useCallback } from "react";

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
}

interface PaymentResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

interface EpayToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

declare global {
  interface Window {
    halyk?: {
      showPaymentWidget: (
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
      #epay-widget-container,
      #halyk-payment-widget {
        max-width: 500px !important;
        max-height: 70vh !important;
        margin-top: 12px !important;
      }

      /* Если виджет использует iframe */
      iframe[src*="epay"],
      iframe[src*="halyk"] {
        max-width: 500px !important;
        max-height: 70vh !important;
        margin-top: 12px !important;
        border-radius: 12px !important;
      }

      /* Overlay/backdrop */
      .epay-overlay,
      .halyk-overlay {
        background: rgba(0, 0, 0, 0.7) !important;
      }

      /* Адаптивность для мобильных */
      @media (max-width: 768px) {
        #epay-widget-container,
        #halyk-payment-widget,
        iframe[src*="epay"],
        iframe[src*="halyk"] {
          margin-top: 10px !important;
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
    ): Promise<EpayToken> => {
      const formData = new URLSearchParams();
      formData.set("grant_type", "client_credentials");
      formData.set("scope", EPAY_CONFIG.scope);
      formData.set("client_id", EPAY_CONFIG.clientId);
      formData.set("client_secret", EPAY_CONFIG.clientSecret);
      formData.set("invoiceID", invoiceId);
      formData.set("secret_hash", secretHash);
      formData.set("amount", amount.toString());
      formData.set("currency", EPAY_CONFIG.currency);
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

        // Получаем токен
        const token = await getToken(invoiceId, params.amount, secretHash);

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
          currency: EPAY_CONFIG.currency,
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

          window.halyk.showPaymentWidget(paymentObject, (result) => {
            console.log("Payment completed:", result);
            setIsLoading(false);
            resolve({
              success: true,
              data: result,
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

  return {
    initiatePayment,
    isLoading,
    error,
  };
};
