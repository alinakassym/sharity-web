import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserData } from "./useRequestCreateUser";

export const useRequestUpdateUserRole = () => {
  const updateUserRole = async (
    telegramId: number,
    newRole: UserData["role"],
  ) => {
    try {
      const userRef = doc(db, "users", telegramId.toString());
      await updateDoc(userRef, {
        role: newRole,
      });

      return { success: true };
    } catch (err) {
      console.error("Ошибка при обновлении роли пользователя:", err);
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Не удалось обновить роль пользователя",
      };
    }
  };

  return { updateUserRole };
};
