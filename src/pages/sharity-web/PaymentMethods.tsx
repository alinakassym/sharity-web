// sharity-web/src/pages/sharity-web/PaymentMethods.tsx

import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRequestGetSavedCards } from "@/hooks/useRequestGetSavedCards";
import { useRequestDeleteCard } from "@/hooks/useRequestDeleteCard";
import { useRequestSetDefaultCard } from "@/hooks/useRequestSetDefaultCard";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import SavedCardItem from "@/components/SavedCardItem";
import LoadingScreen from "@/components/LoadingScreen";
import Container from "@/components/Container";
import { CloseWebViewButton } from "@/components/CloseWebViewButton";
import { isTelegramApp } from "@/lib/telegram";

const PaymentMethods: FC = () => {
  const isTelegram = isTelegramApp();
  const navigate = useNavigate();
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const paddingTop = useSafePaddingTop(48, 0);

  const platformName = useSafePlatform();

  const { userData } = useCurrentUser();
  const { cards, isLoading } = useRequestGetSavedCards(
    userData?.telegramId?.toString(),
  );
  const { deleteCard } = useRequestDeleteCard();
  const { setDefaultCard } = useRequestSetDefaultCard();

  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const handleBack = () => {
    navigate("/profile");
  };

  const handleAddCard = () => {
    navigate("/add-card");
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту карту?")) return;

    setDeletingCardId(cardId);
    const result = await deleteCard(cardId);
    setDeletingCardId(null);

    if (!result.success) {
      alert(`Ошибка: ${result.error}`);
    }
  };

  const handleSetDefaultCard = async (cardId: string) => {
    if (!userData?.telegramId) return;

    const result = await setDefaultCard(userData.telegramId.toString(), cardId);

    if (!result.success) {
      alert(`Ошибка: ${result.error}`);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <Container
      paddingTop={
        platformName === "desktop"
          ? 64
          : platformName === "unknown"
            ? 64
            : paddingTop + 64
      }
    >
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: paddingTop,
          borderBottom: "1px solid " + c.surfaceColor,
          backgroundColor: c.background,
          zIndex: 100,
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: c.background,
          }}
        >
          <div
            style={{
              position: "relative",
              height: 40,
              display: "flex",
              alignItems: "center",
              flex: 1,
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 700,
              color: c.text,
            }}
          >
            Способ оплаты
          </div>

          {/* Close Button */}
          {isTelegram && (
            <button
              onClick={handleBack}
              style={{
                marginLeft: 8,
                marginRight: 8,
                padding: 0,
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "1px solid " + c.accent,
                cursor: "pointer",
                borderRadius: 20,
                transition: "background-color 0.2s ease",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = c.controlColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-label="Закрыть поиск"
            >
              <VuesaxIcon name="close" size={8} color={c.accent} />
            </button>
          )}

          <CloseWebViewButton />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          paddingTop: isTelegram ? 156 : 64,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Заголовок секции */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: c.text,
            margin: "8px 0 0",
          }}
        >
          Платёжные карты
        </h2>

        {/* Список карт */}
        {cards.length === 0 ? (
          <div
            style={{
              backgroundColor: c.surfaceColor,
              borderRadius: 12,
              padding: 40,
              textAlign: "center",
            }}
          >
            <VuesaxIcon name="card" size={48} color={c.lightText} />
            <p
              style={{
                fontSize: 16,
                color: c.lightText,
                margin: "16px 0 0",
              }}
            >
              У вас пока нет сохранённых карт
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cards.map((card) => (
              <SavedCardItem
                key={card.id}
                card={card}
                onDelete={handleDeleteCard}
                onSetDefault={handleSetDefaultCard}
                isDeleting={deletingCardId === card.id}
              />
            ))}
          </div>
        )}

        {/* Кнопка добавления новой карты */}
        <button
          onClick={handleAddCard}
          style={{
            width: "100%",
            padding: 16,
            backgroundColor: c.primary,
            color: c.lighter,
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <VuesaxIcon name="add" size={20} color={c.lighter} />
          Добавить новую карту
        </button>
      </div>
    </Container>
  );
};

export default PaymentMethods;
