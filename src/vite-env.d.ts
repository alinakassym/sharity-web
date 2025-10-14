/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_MINIO_ENDPOINT: string;
  readonly VITE_MINIO_PORT: string;
  readonly VITE_MINIO_USE_SSL: string;
  readonly VITE_MINIO_ACCESS_KEY: string;
  readonly VITE_MINIO_SECRET_KEY: string;
  readonly VITE_MINIO_PRODUCTS_BUCKET: string;
  readonly VITE_YANDEX_MAPS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
