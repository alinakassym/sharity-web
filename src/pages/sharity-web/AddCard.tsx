// sharity-web/src/pages/sharity-web/AddCard.tsx

import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEpayPayment } from "@/hooks/useEpayPayment";
import { useRequestSaveCard } from "@/hooks/useRequestSaveCard";
import { isTelegramApp } from "@/lib/telegram";
import { useSafePaddingTop } from "@/hooks/useTelegramSafeArea";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import LoadingScreen from "@/components/LoadingScreen";

const AddCard: FC = () => {
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const paddingTop = useSafePaddingTop(48, 0);
  const isTelegram = isTelegramApp();

  const { userData, isLoading: isUserLoading } = useCurrentUser();
  const { verifyCard, isLoading: isVerifying } = useEpayPayment();
  const { saveCard, isLoading: isSaving } = useRequestSaveCard();

  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate("/payment-methods");
  };

  const handleVerifyCard = async () => {
    if (!userData?.telegramId) {
      alert("Пользователь не авторизован");
      return;
    }

    setError(null);

    try {
      // Инициируем верификацию карты через halyk.cardverification()
      const verificationResult = await verifyCard({
        accountId: userData.telegramId.toString(),
        payerName:
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
          "Пользователь",
      });

      if (!verificationResult.success) {
        alert(verificationResult.message || "Верификация карты не прошла");
        return;
      }

      // Проверяем что получили все необходимые данные карты
      if (!verificationResult.cardId || !verificationResult.cardMask || !verificationResult.cardType) {
        alert("Не удалось получить данные карты. Попробуйте снова.");
        return;
      }

      console.log("Saving card with data:", {
        cardId: verificationResult.cardId,
        cardMask: verificationResult.cardMask,
        cardType: verificationResult.cardType,
      });

      // Сохраняем карту в Firestore
      const saveResult = await saveCard(
        userData.telegramId.toString(),
        verificationResult.cardId,
        verificationResult.cardMask,
        verificationResult.cardType
      );

      if (!saveResult.success) {
        alert(`Ошибка сохранения: ${saveResult.error}`);
        return;
      }

      // Успех - возвращаемся к списку карт
      navigate("/payment-methods");
    } catch (err) {
      console.error("Card verification error:", err);
      alert(
        err instanceof Error ? err.message : "Произошла ошибка верификации"
      );
    }
  };

  if (isUserLoading) return <LoadingScreen />;

  const isProcessing = isVerifying || isSaving;

  return (
    <section
      style={{
        paddingTop: isTelegram ? paddingTop : 0,
        minHeight: "100vh",
        paddingBottom: "74px",
        backgroundColor: c.background,
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: c.background,
          borderBottom: `1px solid ${c.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          zIndex: 10,
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            padding: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <VuesaxIcon name="arrow-left" size={24} color={c.text} />
        </button>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: c.text,
            margin: "0 0 0 12px",
          }}
        >
          Добавить карту
        </h1>
      </div>

      {/* Content */}
      <div
        style={{
          marginTop: 64,
          padding: 16,
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
            Верификация карты производится без списания средств. Данные карты надёжно
            шифруются и хранятся в соответствии со стандартами безопасности.
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
              {isVerifying ? "Верификация..." : "Сохранение..."}
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
    </section>
  );
};

export default AddCard;
