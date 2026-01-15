// src/lib/minio.ts

import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

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
  import.meta.env.VITE_MINIO_PRODUCTS_BUCKET || "sharity";

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

// Функция для загрузки одного файла в S3
export const uploadFile = async (
  bucketName: string,
  objectName: string,
  file: File,
): Promise<string> => {
  try {
    console.log(
      `Загружаем файл ${file.name} в bucket ${bucketName} как ${objectName}`,
    );

    // Конвертируем File в ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Загружаем файл
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectName,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Формируем URL файла
    const protocol =
      import.meta.env.VITE_MINIO_USE_SSL === "true" ? "https" : "http";
    const endpoint = import.meta.env.VITE_MINIO_ENDPOINT;
    const port = import.meta.env.VITE_MINIO_PORT;

    const url = `${protocol}://${endpoint}${port === "443" || port === "80" ? "" : `:${port}`}/${bucketName}/${objectName}`;

    console.log(`Файл успешно загружен: ${url}`);
    return url;
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    throw error;
  }
};

// Функция для загрузки массива файлов
export const uploadFiles = async (
  bucketName: string,
  files: File[],
): Promise<string[]> => {
  try {
    console.log(`Загружаем ${files.length} файлов в bucket ${bucketName}`);

    const uploadPromises = files.map(async (file, index) => {
      // Генерируем уникальное имя файла
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2);
      const fileExtension = file.name.split(".").pop();
      const objectName = `products/${timestamp}_${randomSuffix}_${index}.${fileExtension}`;

      return uploadFile(bucketName, objectName, file);
    });

    const urls = await Promise.all(uploadPromises);
    console.log(`Все файлы загружены успешно: ${urls.length} URL'ов`);

    return urls;
  } catch (error) {
    console.error("Ошибка загрузки файлов:", error);
    throw error;
  }
};
