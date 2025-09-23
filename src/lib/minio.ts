import * as Minio from "minio";

// Конфигурация Minio клиента
export const minioClient = new Minio.Client({
  endPoint: process.env.VITE_MINIO_ENDPOINT || "localhost",
  port: Number(process.env.VITE_MINIO_PORT) || 9000,
  useSSL: process.env.VITE_MINIO_USE_SSL === "true",
  accessKey: process.env.VITE_MINIO_ACCESS_KEY || "",
  secretKey: process.env.VITE_MINIO_SECRET_KEY || "",
});

// Название bucket для изображений продуктов
export const PRODUCTS_BUCKET =
  process.env.VITE_MINIO_PRODUCTS_BUCKET || "products";

// Функция для загрузки файла
export const uploadFile = async (
  bucketName: string,
  objectName: string,
  file: File,
): Promise<string> => {
  try {
    // Проверяем существование bucket
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
    }

    // Конвертируем File в Buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Загружаем файл
    await minioClient.putObject(bucketName, objectName, fileBuffer, file.size, {
      "Content-Type": file.type,
    });

    // Возвращаем URL файла
    return `${process.env.VITE_MINIO_ENDPOINT}:${process.env.VITE_MINIO_PORT}/${bucketName}/${objectName}`;
  } catch (error) {
    console.error("Ошибка загрузки файла в Minio:", error);
    throw error;
  }
};

// Функция для получения подписанного URL для просмотра
export const getFileUrl = async (
  bucketName: string,
  objectName: string,
  expiry: number = 24 * 60 * 60, // 24 часа по умолчанию
): Promise<string> => {
  try {
    return await minioClient.presignedGetObject(bucketName, objectName, expiry);
  } catch (error) {
    console.error("Ошибка получения URL файла из Minio:", error);
    throw error;
  }
};

// Функция для удаления файла
export const deleteFile = async (
  bucketName: string,
  objectName: string,
): Promise<void> => {
  try {
    await minioClient.removeObject(bucketName, objectName);
  } catch (error) {
    console.error("Ошибка удаления файла из Minio:", error);
    throw error;
  }
};
