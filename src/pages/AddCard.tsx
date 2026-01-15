// src/pages/AddCard.tsx

import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEpayPayment } from "@/hooks/useEpayPayment";
import { isTelegramApp } from "@/lib/telegram";
import { useSafePaddingTop } from "@/hooks/useTelegramSafeArea";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import LoadingScreen from "@/components/LoadingScreen";
import PageHeader from "@/components/PageHeader";
import { Container } from "@mui/material";

const AddCard: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const paddingTop = useSafePaddingTop(48, 0);
  const isTelegram = isTelegramApp();

  const { userData, isLoading: isUserLoading } = useCurrentUser();
  const { verifyCard, isLoading: isVerifying } = useEpayPayment();

  const [error, setError] = useState<string | null>(null);

  const handleVerifyCard = async () => {
    if (!userData?.telegramId) {
      alert("Пользователь не авторизован");
      return;
    }

    setError(null);

    try {
      // Инициируем верификацию карты через halyk.cardverification()
      // Сохранение карты произойдет автоматически через webhook на сервере
      await verifyCard({
        accountId: userData.telegramId.toString(),
        payerName:
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
          "Пользователь",
      });

      // После верификации возвращаемся к списку карт
      // Карта будет видна благодаря real-time обновлению
      navigate("/payment-methods");
    } catch (err) {
      console.error("Card verification error:", err);
      alert(
        err instanceof Error ? err.message : "Произошла ошибка верификации",
      );
    }
  };

  if (isUserLoading) return <LoadingScreen />;

  const isProcessing = isVerifying;

  return (
    <Container
      style={{
        paddingTop: isTelegram ? paddingTop : 0,
        minHeight: "100vh",
        paddingBottom: "74px",
        backgroundColor: c.background,
      }}
    >
      {/* Page Header */}
      <PageHeader title="Добавить карту" backTo="/payment-methods" />

      {/* Content */}
      <div
        style={{
          marginTop: 64,
          padding: "16px 0",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Информационный блок */}
        <div
          style={{
            backgroundColor: c.surfaceColor,
            borderRadius: 12,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: `${c.primary}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VuesaxIcon name="shield-tick" size={24} color={c.primary} />
            </div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: c.text,
                margin: 0,
              }}
            >
              Безопасное добавление
            </h2>
          </div>
          <p
            style={{
              fontSize: 14,
              color: c.lightText,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Мы используем защищённое соединение для верификации вашей карты.
            Верификация карты производится без списания средств. Данные карты
            надёжно шифруются и хранятся в соответствии со стандартами
            безопасности.
          </p>
        </div>

        {/* Описание процесса */}
        <div
          style={{
            backgroundColor: c.surfaceColor,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: c.text,
              margin: "0 0 16px",
            }}
          >
            Как это работает:
          </h3>
          <ol
            style={{
              margin: 0,
              padding: "0 0 0 20px",
              color: c.text,
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            <li>Нажмите кнопку "Добавить карту"</li>
            <li>Введите данные карты в защищённой форме</li>
            <li>Карта будет автоматически сохранена</li>
            <li>Используйте её для быстрых покупок</li>
          </ol>
        </div>

        {/* Сообщение об ошибке */}
        {error && (
          <div
            style={{
              backgroundColor: "#FF6B6B20",
              borderRadius: 12,
              padding: 16,
              color: "#FF6B6B",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <VuesaxIcon name="info-circle" size={20} color="#FF6B6B" />
            {error}
          </div>
        )}

        {/* Кнопка добавления */}
        <button
          onClick={handleVerifyCard}
          disabled={isProcessing}
          style={{
            width: "100%",
            padding: 16,
            backgroundColor: isProcessing ? c.controlColor : c.primary,
            color: isProcessing ? c.lightText : c.lighter,
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: isProcessing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {isProcessing ? (
            <>
              <VuesaxIcon name="clock" size={20} color={c.lightText} />
              Верификация...
            </>
          ) : (
            <>
              <VuesaxIcon name="card-add" size={20} color={c.lighter} />
              Добавить карту
            </>
          )}
        </button>

        {/* Примечание о безопасности */}
        <p
          style={{
            fontSize: 12,
            color: c.lightText,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Нажимая "Добавить карту", вы соглашаетесь с условиями использования
          платёжной системы. Верификация производится без списания средств.
        </p>
      </div>
    </Container>
  );
};

export default AddCard;
