// src/pages/Checkout.tsx

import { useState, useEffect } from "react";
import type { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEpayPayment } from "@/hooks/useEpayPayment";
import { useRequestSavePendingOrder } from "@/hooks/useRequestSavePendingOrder";
import Container from "@/components/Container";
import { isTelegramApp } from "@/lib/telegram";
import ProductHeader from "@/components/ProductHeader";
import { generateOrderNumber } from "@/lib/orders";

interface CheckoutProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const Checkout: FC = () => {
  const isTelegram = isTelegramApp();
  const navigate = useNavigate();
  const location = useLocation();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const { userData } = useCurrentUser();
  const { initiatePayment, isLoading: isPaymentLoading } = useEpayPayment();
  const { savePendingOrder } = useRequestSavePendingOrder();

  const handleBackClick = () => {
    navigate(-1);
  };

  const backTo = (location.state as { from?: string })?.from || "/";

  // Получаем данные товара из state (переданные со страницы Product)
  const product = location.state?.product as CheckoutProduct | undefined;

  // Адрес доставки
  const [deliveryAddress, setDeliveryAddress] = useState({
    city: "Астана",
    street: "",
    building: "",
    apartment: "",
  });

  const [phone, setPhone] = useState("");

  // Если товар не передан - возвращаемся назад
  useEffect(() => {
    if (!product) {
      navigate(-1);
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  // Форматирование цены
  const KZT = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  });

  const deliveryFee = 500; // Стоимость доставки
  const totalAmount = product.price + deliveryFee;

  const isFormValid =
    deliveryAddress.city &&
    deliveryAddress.street &&
    deliveryAddress.building &&
    phone;

  const handlePayment = async () => {
    if (!isFormValid) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    // Генерируем уникальный invoiceId
    const invoiceId = `${Date.now()}`.slice(-12);

    // Подготавливаем данные заказа
    const orderData = {
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.image,
      productCategory: product.category,
      deliveryAddress: {
        city: deliveryAddress.city,
        street: deliveryAddress.street,
        building: deliveryAddress.building,
        apartment: deliveryAddress.apartment,
        phone,
      },
      orderNumber: generateOrderNumber(), // Генерируем читаемый номер заказа
      amount: product.price,
      deliveryFee,
      totalAmount,
      buyerId: userData?.telegramId?.toString() || "guest",
      buyerTelegramId: userData?.telegramId,
      buyerUsername: userData?.username,
      buyerName:
        `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
        "Покупатель",
    };

    // Сохраняем данные заказа в Firestore (вместо sessionStorage)
    const saveResult = await savePendingOrder(invoiceId, orderData);

    if (!saveResult.success) {
      alert("Ошибка при сохранении данных заказа");
      return;
    }

    // Также сохраняем в sessionStorage для обратной совместимости
    sessionStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        ...orderData,
        invoiceId,
      }),
    );

    const paymentResult = await initiatePayment({
      amount: totalAmount,
      description: `Покупка: ${product.name}`,
      invoiceId, // Передаём invoiceId в платёжную систему
      accountId: userData?.telegramId?.toString() || "guest",
      payerName:
        `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
        "Покупатель",
    });

    // Проверяем результат оплаты
    if (paymentResult.success) {
      // Оплата прошла успешно - переходим на страницу успеха
      console.log("Payment successful, navigating to success page");
      navigate(`/payment/success?invoiceId=${invoiceId}`);
    } else {
      // Оплата не прошла или виджет закрыт - остаёмся на этой странице
      console.log("Payment was not successful or widget closed");
      // Очищаем данные заказа
      sessionStorage.removeItem("pendingOrder");
    }
  };

  return (
    <Container paddingTop={isTelegram ? 112 : 64}>
      {/* Header */}
      <ProductHeader onGoBack={handleBackClick} backTo={backTo} />

      <div style={{ padding: 16, paddingBottom: 32 }}>
        {/* Карточка товара */}
        <div
          style={{
            backgroundColor: c.surfaceColor,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            display: "flex",
            gap: 12,
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                color: c.lightText,
                marginBottom: 4,
              }}
            >
              {product.category}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: c.text,
                marginBottom: 8,
              }}
            >
              {product.name}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: c.primary,
              }}
            >
              {KZT.format(product.price)}
            </div>
          </div>
        </div>

        {/* Форма адреса доставки */}
        <div
          style={{
            backgroundColor: c.surfaceColor,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: c.text,
              margin: "0 0 16px",
            }}
          >
            Адрес доставки
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="text"
              placeholder="Город *"
              value={deliveryAddress.city}
              disabled
              style={{
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${c.border}`,
                fontSize: 14,
                color: c.lightText,
                backgroundColor: c.controlColor,
                cursor: "not-allowed",
              }}
            />

            <input
              type="text"
              placeholder="Улица *"
              value={deliveryAddress.street}
              onChange={(e) =>
                setDeliveryAddress({
                  ...deliveryAddress,
                  street: e.target.value,
                })
              }
              style={{
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${c.border}`,
                fontSize: 14,
                color: c.text,
                backgroundColor: c.background,
              }}
            />

            <div style={{ width: "100%", display: "flex", gap: 12 }}>
              <div>
                <input
                  type="text"
                  placeholder="Дом *"
                  value={deliveryAddress.building}
                  onChange={(e) =>
                    setDeliveryAddress({
                      ...deliveryAddress,
                      building: e.target.value,
                    })
                  }
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    border: `1px solid ${c.border}`,
                    fontSize: 14,
                    color: c.text,
                    backgroundColor: c.background,
                  }}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Квартира"
                  value={deliveryAddress.apartment}
                  onChange={(e) =>
                    setDeliveryAddress({
                      ...deliveryAddress,
                      apartment: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: `1px solid ${c.border}`,
                    fontSize: 14,
                    color: c.text,
                    backgroundColor: c.background,
                  }}
                />
              </div>
            </div>

            <input
              type="tel"
              placeholder="Телефон *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${c.border}`,
                fontSize: 14,
                color: c.text,
                backgroundColor: c.background,
              }}
            />
          </div>
        </div>

        {/* Итоговая сумма */}
        <div
          style={{
            backgroundColor: c.surfaceColor,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: c.text,
              margin: "0 0 12px",
            }}
          >
            Итого
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 14, color: c.lightText }}>Товар</span>
            <span style={{ fontSize: 14, color: c.text }}>
              {KZT.format(product.price)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: `1px solid ${c.border}`,
            }}
          >
            <span style={{ fontSize: 14, color: c.lightText }}>Доставка</span>
            <span style={{ fontSize: 14, color: c.text }}>
              {KZT.format(deliveryFee)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: c.text }}>
              Итого
            </span>
            <span style={{ fontSize: 16, fontWeight: 600, color: c.primary }}>
              {KZT.format(totalAmount)}
            </span>
          </div>
        </div>

        {/* Кнопка оплаты */}
        <button
          onClick={handlePayment}
          disabled={!isFormValid || isPaymentLoading}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor:
              !isFormValid || isPaymentLoading ? c.controlColor : c.primary,
            color: !isFormValid || isPaymentLoading ? c.lightText : c.lighter,
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 600,
            cursor:
              !isFormValid || isPaymentLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {isPaymentLoading ? "Загрузка..." : "Оформить заказ"}
        </button>
      </div>
    </Container>
  );
};

export default Checkout;
