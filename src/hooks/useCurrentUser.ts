import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getTelegramUser } from "@/lib/telegram";
import type { UserData } from "./useRequestCreateUser";

export const useCurrentUser = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { user } = getTelegramUser();

        if (!user) {
          setError("Данные пользователя Telegram не найдены");
          setIsLoading(false);
          return;
        }

        // Получаем данные пользователя из Firebase
        const userRef = doc(db, "users", user.id.toString());
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
        } else {
          setError("Пользователь не найден в базе данных");
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Ошибка при загрузке данных пользователя:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Произошла ошибка при загрузке данных",
        );
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, isLoading, error };
};
