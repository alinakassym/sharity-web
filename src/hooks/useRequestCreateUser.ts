import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { stripUndefined } from "@/utils";

export interface UserData {
  telegramId: number;
  username?: string;
  firstName?: string; // Теперь опционально - зависит от выбора пользователя
  lastName?: string;
  languageCode?: string;
  allowsWriteToPm?: boolean;
  photoUrl?: string;
  phoneNumber?: string; // Для будущего использования
  isConfirmed?: boolean; // Флаг подтверждения авторизации (true - согласен, false - отмена)
  createdAt: Date;
  lastLoginAt: Date;
  role: "admin" | "manager" | "user";
}

export const useRequestCreateUser = () => {
  const checkUserExists = async (telegramId: number): Promise<boolean> => {
    try {
      const userRef = doc(db, "users", telegramId.toString());
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (err) {
      console.error("Ошибка при проверке пользователя:", err);
      return false;
    }
  };

  const createOrUpdateUser = async (
    userData: Omit<UserData, "createdAt" | "lastLoginAt" | "role">,
  ) => {
    try {
      // Используем telegramId как ID документа
      const userRef = doc(db, "users", userData.telegramId.toString());

      // Проверяем, существует ли пользователь
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Пользователь существует - обновляем переданные данные и lastLoginAt
        const existingData = userSnap.data();

        const updateData: Partial<UserData> = stripUndefined({
          ...userData,
          lastLoginAt: new Date(),
        });

        // Если у существующего пользователя нет роли, устанавливаем "user"
        if (!existingData.role) {
          updateData.role = "user";
        }

        await setDoc(userRef, updateData, { merge: true });
        console.log("Пользователь обновлен:", userData.telegramId);
        return { success: true, isNewUser: false, id: userData.telegramId };
      } else {
        // Новый пользователь - создаем документ
        const dataToSave: UserData = {
          ...stripUndefined(userData as Record<string, unknown>),
          telegramId: userData.telegramId, // Ensure telegramId is included
          firstName: userData?.firstName ?? "",
          lastName: userData?.lastName ?? "",
          photoUrl: userData?.photoUrl ?? "",
          isConfirmed: userData?.isConfirmed ?? true, // По умолчанию true для обратной совместимости
          role: "user", // По умолчанию новый пользователь получает роль "user"
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };

        await setDoc(userRef, dataToSave);
        console.log("Новый пользователь создан:", userData.telegramId);
        return { success: true, isNewUser: true, id: userData.telegramId };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при создании/обновлении пользователя";
      console.error("Ошибка при сохранении пользователя:", err);
      return { success: false, error: errorMessage };
    }
  };

  return {
    checkUserExists,
    createOrUpdateUser,
  };
};
