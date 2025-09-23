import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Конфигурация для Hetzner Object Storage (S3-совместимое хранилище)
export const s3Client = new S3Client({
  endpoint: `${import.meta.env.VITE_MINIO_USE_SSL === "true" ? "https" : "http"}://${import.meta.env.VITE_MINIO_ENDPOINT}`,
  region: "us-east-1", // Обязательно для S3 совместимых хранилищ
  credentials: {
    accessKeyId: import.meta.env.VITE_MINIO_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Обязательно для совместимости с Object Storage
});

// Название bucket для изображений продуктов
export const PRODUCTS_BUCKET =
  import.meta.env.VITE_MINIO_PRODUCTS_BUCKET || "products";

// Тест подключения через листинг содержимого bucket "sharity"
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log(
      "Тестируем подключение к Hetzner Object Storage через AWS S3 SDK...",
    );
    console.log("Пытаемся получить список объектов в bucket 'sharity'...");

    // Листинг содержимого bucket "sharity"
    const command = new ListObjectsV2Command({
      Bucket: "sharity",
    });

    const response = await s3Client.send(command);

    const objectCount = response.Contents?.length || 0;
    console.log(
      `Подключение успешно! Найдено объектов в bucket 'sharity': ${objectCount}`,
    );

    // Выводим первые несколько объектов для демонстрации
    if (response.Contents && response.Contents.length > 0) {
      console.log("Примеры объектов:");
      response.Contents.slice(0, 5).forEach((obj) => {
        console.log("- ", obj.Key);
      });
    }

    return true;
  } catch (error) {
    console.error("Ошибка подключения к Object Storage:", error);
    return false;
  }
};

// TODO: Функции для работы с файлами будут добавлены позже
// после того как убедимся что базовое подключение работает
