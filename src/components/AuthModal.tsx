import { useState } from "react";
import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { Button } from "@mui/material";
import VuesaxIcon from "./icons/VuesaxIcon";

interface AuthModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ onConfirm, onCancel }) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    await onConfirm();
    setIsConfirming(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        style={{
          backgroundColor: c.background,
          borderRadius: 20,
          padding: 24,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: c.primary + "20",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VuesaxIcon name="user" size={32} color={c.primary} />
          </div>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: c.text,
            margin: "0 0 12px",
            textAlign: "center",
          }}
        >
          Авторизация
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 15,
            color: c.lightText,
            lineHeight: 1.5,
            margin: "0 0 24px",
            textAlign: "center",
          }}
        >
          Для продолжения работы необходимо авторизоваться. Приложение получит
          следующие данные из вашего аккаунта Telegram:
        </p>

        {/* Permission list */}
        <div
          style={{
            backgroundColor: c.surfaceColor,
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <VuesaxIcon name="user" size={20} color={c.primary} />
              <span style={{ fontSize: 14, color: c.text }}>Имя и фамилия</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <VuesaxIcon name="profile" size={20} color={c.primary} />
              <span style={{ fontSize: 14, color: c.text }}>
                Username (логин)
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <VuesaxIcon name="camera" size={20} color={c.primary} />
              <span style={{ fontSize: 14, color: c.text }}>Фото профиля</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexDirection: "column",
          }}
        >
          <Button
            size="large"
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Авторизация..." : "Согласен"}
          </Button>
          <Button
            size="large"
            fullWidth
            variant="outlined"
            onClick={onCancel}
            disabled={isConfirming}
          >
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
