import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";
import type { UserData } from "@/hooks/useRequestCreateUser";

interface UserProfileCardProps {
  userData: UserData;
}

const UserProfileCard: FC<UserProfileCardProps> = ({ userData }) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  // Формируем полное имя
  const fullName = [userData.firstName, userData.lastName]
    .filter(Boolean)
    .join(" ");

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
      </div>
    </div>
  );
};

export default UserProfileCard;
