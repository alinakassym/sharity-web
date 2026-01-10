// sharity-web/src/lib/firebase.ts

import { initializeApp, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("projectId:", getApp().options.projectId);

// Веб: включаем офлайн-кеш (IndexedDB). Может не работать в нескольких вкладках.
enableIndexedDbPersistence(db).catch(() => {
  /* ok, просто пропускаем если failed-precondition/unimplemented */
});
