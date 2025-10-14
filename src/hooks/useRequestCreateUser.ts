import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserData {
  telegramId: number;
  username?: string;
  firstName: string;
  lastName?: string;
  languageCode?: string;
  allowsWriteToPm?: boolean;
  photoUrl?: string;
  phoneNumber?: string; // Для будущего использования
  createdAt: Date;
  lastLoginAt: Date;
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
    userData: Omit<UserData, "createdAt" | "lastLoginAt">,
  ) => {
    try {
      // Используем telegramId как ID документа
      const userRef = doc(db, "users", userData.telegramId.toString());

      // Проверяем, существует ли пользователь
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Пользователь существует - обновляем только lastLoginAt и другие данные
        await setDoc(
          userRef,
          {
            ...userData,
            lastLoginAt: new Date(),
          },
          { merge: true },
        );
        console.log("Пользователь обновлен:", userData.telegramId);
        return { success: true, isNewUser: false, id: userData.telegramId };
      } else {
        // Новый пользователь - создаем документ
        const dataToSave: UserData = {
          ...userData,
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
