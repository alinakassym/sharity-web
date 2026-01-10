// sharity-web/src/lib/telegram.ts

export type TGUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
};

export type TG = {
  initData?: string;
  initDataUnsafe?: { user?: TGUser };
  ready: () => void;
  expand: () => void;
  disableVerticalSwipes: () => void;
  enableVerticalSwipes: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  platform?: string; // "android", "ios", "macos", "tdesktop", "unigram", "web", "weba", "webk", "unknown"
  safeAreaInset?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  contentSafeAreaInset?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
};

// (опционально) объявим типизированное окно — меньше any/кастов
declare global {
  interface Window {
    Telegram?: { WebApp?: TG };
  }
}

export function getTG(): TG | undefined {
  return window?.Telegram?.WebApp as TG | undefined;
}

export const getTelegramUser = () => {
  const tg = getTG();
  return {
    user: tg?.initDataUnsafe?.user,
    initData: tg?.initData, // подписанная строка
  };
};

export function isTelegramApp(): boolean {
  if (typeof window === "undefined") return false;

  const tg = (
    window as Window & { Telegram?: { WebApp?: { initData?: string } } }
  ).Telegram?.WebApp;
  // Вне Telegram initData = "" (пустая строка)
  return !!tg?.initData && tg.initData.length > 0;
}

// Аккуратно просим fullscreen, если клиент умеет
export async function requestTgFullscreen(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Типобезопасный доступ к Telegram.WebApp
  const tg = (
    window as Window & {
      Telegram?: {
        WebApp?: {
          ready: () => void;
          expand: () => void;
          requestFullscreen?: () => void; // новые клиенты
          isExpanded?: boolean; // бэк-совместимости нет, просто не упасть
        };
      };
    }
  ).Telegram?.WebApp;

  if (!tg) return false;

  try {
    // сначала разворачиваем доступную высоту
    tg.expand();
    // если у клиента есть новый API — просим fullscreen
    if (typeof tg.requestFullscreen === "function") {
      tg.requestFullscreen();
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
