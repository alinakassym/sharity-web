// sharity-web/src/components/SavedCardItem.tsx

import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
import type { SavedCard } from "@/types/cards";

interface SavedCardItemProps {
  card: SavedCard;
  onDelete: (cardId: string) => void;
  onSetDefault: (cardId: string) => void;
  isDeleting?: boolean;
}

const SavedCardItem: FC<SavedCardItemProps> = ({
  card,
  onDelete,
  onSetDefault,
  isDeleting = false,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  return (
    <div
      style={{
        backgroundColor: c.surfaceColor,
        borderRadius: 12,
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 12,
        border: card.isDefault
          ? `2px solid ${c.primary}`
          : `1px solid ${c.border}`,
      }}
    >
      {/* Иконка карты */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: `${c.primary}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <VuesaxIcon name="card" size={24} color={c.primary} />
      </div>

      {/* Информация о карте */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: c.text,
            marginBottom: 4,
          }}
        >
          {card.cardMask}
        </div>
        <div
          style={{
            fontSize: 12,
            color: c.lightText,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>{card.cardType}</span>
          {card.isDefault && (
            <span
              style={{
                padding: "2px 8px",
                backgroundColor: `${c.primary}20`,
                color: c.primary,
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              По умолчанию
            </span>
          )}
        </div>
      </div>

      {/* Кнопки действий */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {!card.isDefault && (
          <button
            onClick={() => onSetDefault(card.id)}
            style={{
              padding: 8,
              backgroundColor: c.controlColor,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Сделать основной"
          >
            <VuesaxIcon name="star" size={20} color={c.text} />
          </button>
        )}
        <button
          onClick={() => onDelete(card.id)}
          disabled={isDeleting}
          style={{
            padding: 8,
            backgroundColor: "#FF6B6B20",
            border: "none",
            borderRadius: 8,
            cursor: isDeleting ? "not-allowed" : "pointer",
            opacity: isDeleting ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Удалить"
        >
          <VuesaxIcon name="trash" size={20} color="#FF6B6B" />
        </button>
      </div>
    </div>
  );
};

export default SavedCardItem;
