// src/utils/runtimeEnv.ts
export type RuntimeEnv =
  | "telegram-miniapp"
  | "react-native-webview"
  | "telegram-inapp-browser"
  | "browser";

// опционально: руками можно передать контекст ?ctx=webview|tg|browser
function ctxFromQuery(): RuntimeEnv | null {
  const p = new URLSearchParams(window.location.search).get("ctx");
  if (p === "webview") return "react-native-webview";
  if (p === "tg") return "telegram-miniapp";
  if (p === "browser") return "browser";
  return null;
}

export function detectRuntime(): RuntimeEnv {
  const forced = ctxFromQuery();
  if (forced) return forced;

  // 1) Telegram Mini App (точный признак)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
    return "telegram-miniapp";
  }

  // 2) React Native / Expo WebView
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (window as any).ReactNativeWebView !== "undefined") {
    return "react-native-webview";
  }

  // 3) Telegram in-app browser по обычной ссылке (не Mini App)
  if (/Telegram/i.test(navigator.userAgent)) {
    return "telegram-inapp-browser";
  }

  // 4) Обычный браузер
  return "browser";
}

// Удобные флаги
export const isTgMiniApp = () => detectRuntime() === "telegram-miniapp";
export const isRNWebView = () => detectRuntime() === "react-native-webview";
