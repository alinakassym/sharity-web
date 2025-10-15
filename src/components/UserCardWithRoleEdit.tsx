import type { FC } from "react";
import { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
import type { UserData } from "@/hooks/useRequestCreateUser";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useRequestUpdateUserRole } from "@/hooks/useRequestUpdateUserRole";

interface UserCardWithRoleEditProps {
  userData: UserData;
  onRoleUpdate?: (telegramId: number, newRole: UserData["role"]) => void;
}

const UserCardWithRoleEdit: FC<UserCardWithRoleEditProps> = ({
  userData,
  onRoleUpdate,
}) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const { updateUserRole } = useRequestUpdateUserRole();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserData["role"]>(
    userData.role,
  );

  // Формируем полное имя
  const fullName = [userData.firstName, userData.lastName]
    .filter(Boolean)
    .join(" ");

  // Определяем label и цвет для Chip в зависимости от роли
  const getRoleChipProps = (role: UserData["role"]) => {
    switch (role) {
      case "admin":
        return { label: "Админ", color: "accent" as const };
      case "manager":
        return { label: "Менеджер", color: "primary" as const };
      default:
        return { label: "Пользователь", color: "lightText" as const };
    }
  };

  const handleRoleChange = async (newRole: UserData["role"]) => {
    setIsUpdating(true);

    const result = await updateUserRole(userData.telegramId, newRole);

    if (result.success) {
      setCurrentRole(newRole);
      onRoleUpdate?.(userData.telegramId, newRole);
    } else {
      // В случае ошибки возвращаем предыдущее значение
      alert(result.error || "Не удалось обновить роль");
    }

    setIsUpdating(false);
  };

  const roleChipProps = getRoleChipProps(currentRole);

  return (
    <div
      style={{
        backgroundColor: c.surfaceColor,
        borderRadius: 20,
        padding: 20,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: c.primary + "20",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {userData.photoUrl ? (
          <img
            src={userData.photoUrl}
            alt={fullName || userData.username || "User"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <VuesaxIcon name="user" size={40} color={c.primary} />
        )}
      </div>

      {/* User Info */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minWidth: 0, // Для корректного overflow
        }}
      >
        {/* Full Name */}
        {fullName && (
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: c.text,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {fullName}
          </div>
        )}

        {/* Username */}
        {userData.username && (
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: c.lightText,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            @{userData.username}
          </div>
        )}

        {/* Role Selector */}
        <div style={{ marginTop: 8 }}>
          <Select
            value={currentRole}
            onChange={(e) =>
              handleRoleChange(e.target.value as UserData["role"])
            }
            disabled={isUpdating}
            size="small"
            sx={{
              fontSize: 12,
              fontWeight: 600,
              minWidth: 140,
              backgroundColor: c[roleChipProps.color],
              color:
                roleChipProps.color === "accent" ? c.darken : c.lighter,
              border: "none",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": {
                padding: "6px 12px",
              },
            }}
          >
            <MenuItem value="user">
              <Chip
                label="Пользователь"
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  backgroundColor: c.lightText,
                  color: c.lighter,
                }}
              />
            </MenuItem>
            <MenuItem value="manager">
              <Chip
                label="Менеджер"
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  backgroundColor: c.primary,
                  color: c.lighter,
                }}
              />
            </MenuItem>
            <MenuItem value="admin">
              <Chip
                label="Админ"
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  backgroundColor: c.accent,
                  color: c.darken,
                }}
              />
            </MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UserCardWithRoleEdit;
