import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserData } from "./useRequestCreateUser";

export const useRequestGetUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const usersData: UserData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          usersData.push({
            telegramId: data.telegramId,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            languageCode: data.languageCode,
            allowsWriteToPm: data.allowsWriteToPm,
            photoUrl: data.photoUrl,
            phoneNumber: data.phoneNumber,
            createdAt: data.createdAt?.toDate() || new Date(),
            lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
            role: data.role || "user",
          });
        });

        setUsers(usersData);
      } catch (err) {
        console.error("Ошибка при загрузке пользователей:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить пользователей",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, isLoading, error };
};
