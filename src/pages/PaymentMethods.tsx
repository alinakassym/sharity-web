// src/pages/PaymentMethods.tsx

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
import PageHeader from "@/components/PageHeader";

const PaymentMethods: FC = () => {
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
      {/* Page Header */}
      <PageHeader title="Мои карты" backTo="/profile" />

      {/* Content */}
      <div
        style={{
          paddingTop: 0,
          paddingLeft: 16,
          paddingRight: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
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
            <VuesaxIcon name="card" size={48} stroke={c.lightText} />
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
