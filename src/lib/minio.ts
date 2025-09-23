// Конфигурация для Minio

export const MINIO_CONFIG = {
  // import.meta.env.VITE_FIREBASE_API_KEY
  endpoint: import.meta.env.VITE_MINIO_ENDPOINT,
  port: Number(import.meta.env.VITE_MINIO_PORT),
  useSSL: import.meta.env.VITE_MINIO_USE_SSL,
  accessKey: import.meta.env.VITE_MINIO_ACCESS_KEY,
  secretKey: import.meta.env.VITE_MINIO_SECRET_KEY,
};

// Название bucket для изображений продуктов
export const PRODUCTS_BUCKET =
  import.meta.env.VITE_MINIO_PRODUCTS_BUCKET || "products";

// Простая функция для тестирования подключения к Minio
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log("Тестируем подключение к Minio через HTTP...");

    const protocol = MINIO_CONFIG.useSSL ? "https" : "http";
    const url = `${protocol}://${MINIO_CONFIG.endpoint}:${MINIO_CONFIG.port}/minio/health/live`;

    const response = await fetch(url);
    console.log("Ответ сервера:", response.status);

    if (response.ok) {
      console.log("Подключение к Minio успешно!");
      return true;
    } else {
      console.log("Сервер Minio недоступен");
      return false;
    }
  } catch (error) {
    console.error("Ошибка подключения к Minio:", error);
    return false;
  }
};

// TODO: Функции для работы с файлами будут добавлены позже
// после того как убедимся что базовое подключение работает
