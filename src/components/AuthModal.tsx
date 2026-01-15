// src/components/AuthModal.tsx

import { useState } from "react";
import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import VuesaxIcon from "./icons/VuesaxIcon";

export interface AuthPermissions {
  includeFirstName: boolean;
  includeLastName: boolean;
  includePhoto: boolean;
}

interface AuthModalProps {
  onConfirm: (permissions: AuthPermissions) => void;
  onCancel: (permissions: AuthPermissions) => void;
}

const AuthModal: FC<AuthModalProps> = ({ onConfirm, onCancel }) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const [isConfirming, setIsConfirming] = useState(false);
  const [includeFirstName, setIncludeFirstName] = useState(true);
  const [includeLastName, setIncludeLastName] = useState(true);
  const [includePhoto, setIncludePhoto] = useState(true);

  const handleConfirm = async () => {
    setIsConfirming(true);
    await onConfirm({
      includeFirstName,
      includeLastName,
      includePhoto,
    });
    setIsConfirming(false);
  };

  const handleCancel = async () => {
    setIsConfirming(true);
    await onCancel({
      includeFirstName,
      includeLastName,
      includePhoto,
    });
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
            margin: "0 0 16px",
            textAlign: "center",
          }}
        >
          Для продолжения работы необходимо авторизоваться. Выберите данные,
          которые готовы предоставить приложению:
        </p>

        {/* Permissions form */}
        <div
          style={{
            backgroundColor: c.surfaceColor,
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 24,
          }}
        >
          {/* Username - always required */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 0",
              borderBottom: `1px solid ${c.border}`,
            }}
          >
            <VuesaxIcon name="profile" size={20} color={c.primary} />
            <span style={{ fontSize: 14, color: c.text, flex: 1 }}>
              Username (логин)
            </span>
            <span
              style={{
                fontSize: 12,
                color: c.primary,
                fontWeight: 600,
              }}
            >
              Обязательно
            </span>
          </div>

          {/* First Name - optional */}
          <div style={{ padding: "4px 0" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeFirstName}
                  onChange={(e) => setIncludeFirstName(e.target.checked)}
                  sx={{
                    color: c.lightText,
                    "&.Mui-checked": {
                      color: c.primary,
                    },
                  }}
                />
              }
              label={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <VuesaxIcon name="user" size={18} color={c.text} />
                  <span style={{ fontSize: 14, color: c.text }}>Имя</span>
                </div>
              }
            />
          </div>

          {/* Last Name - optional */}
          <div style={{ padding: "4px 0" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeLastName}
                  onChange={(e) => setIncludeLastName(e.target.checked)}
                  sx={{
                    color: c.lightText,
                    "&.Mui-checked": {
                      color: c.primary,
                    },
                  }}
                />
              }
              label={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <VuesaxIcon name="user" size={18} color={c.text} />
                  <span style={{ fontSize: 14, color: c.text }}>Фамилия</span>
                </div>
              }
            />
          </div>

          {/* Photo - optional */}
          <div style={{ padding: "4px 0" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includePhoto}
                  onChange={(e) => setIncludePhoto(e.target.checked)}
                  sx={{
                    color: c.lightText,
                    "&.Mui-checked": {
                      color: c.primary,
                    },
                  }}
                />
              }
              label={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <VuesaxIcon name="camera" size={18} color={c.text} />
                  <span style={{ fontSize: 14, color: c.text }}>
                    Фото профиля
                  </span>
                </div>
              }
            />
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
            onClick={handleCancel}
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
