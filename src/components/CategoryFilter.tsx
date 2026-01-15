// src/components/CategoryFilter.tsx
import { useMemo } from "react";
import type { FC } from "react";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";

export type Category = {
  id: string;
  label: string;
  icon: string; // имя для VuesaxIcon
};

type Props = {
  title?: string;
  categories: Category[];
  selectedIds: string[]; // контролируемый список выбранных
  onChange: (next: string[]) => void;
  multi?: boolean; // множественный выбор (по умолчанию true)
  onOpenFilter?: () => void; // клик по "Фильтр"
};

export const CategoryFilter: FC<Props> = ({
  title = "Категории",
  categories,
  selectedIds,
  onChange,
  multi = true,
  onOpenFilter,
}) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggle = (id: string) => {
    if (multi) {
      const next = new Set(selectedSet);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      onChange([...next]);
    } else {
      onChange(selectedSet.has(id) ? [] : [id]);
    }
  };

  return (
    <section style={{ width: "100%" }}>
      {/* Заголовок + "Фильтр" */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: colors.text,
          }}
        >
          {title}
        </h2>
        <button
          onClick={onOpenFilter}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: colors.primary,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Фильтр
        </button>
      </div>

      {/* Сетка карточек-пилюль */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {categories.map((c) => {
          const active = selectedSet.has(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              aria-pressed={active}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                border: "none",
                cursor: "pointer",
                borderRadius: 24,
                backgroundColor: active ? colors.primary : colors.controlColor,
                color: active ? colors.lighter : colors.text,
                textAlign: "left",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.02)",
                outline: "none",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <VuesaxIcon name={c.icon} size={24} />
              </span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{c.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryFilter;
