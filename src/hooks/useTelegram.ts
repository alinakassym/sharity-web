import { useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  allows_write_to_pm?: boolean;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    receiver?: TelegramUser;
    chat?: Record<string, unknown>;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive: boolean): void;
    hideProgress(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  HapticFeedback: {
    impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): void;
    notificationOccurred(type: "error" | "success" | "warning"): void;
    selectionChanged(): void;
  };
  ready(): void;
  expand(): void;
  close(): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  postEvent(eventType: string, eventData?: unknown): void;
  sendData(data: string): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type?: string; text?: string }>;
  }, callback?: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  showScanQrPopup(params: { text?: string }, callback?: (text: string) => boolean): void;
  closeScanQrPopup(): void;
  readTextFromClipboard(callback?: (text: string) => void): void;
  requestWriteAccess(callback?: (granted: boolean) => void): void;
  requestContact(callback?: (granted: boolean) => void): void;
  switchInlineQuery(query: string, choose_chat_types?: string[]): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isTelegramApp, setIsTelegramApp] = useState(false);

  useEffect(() => {
    // Проверяем доступность Telegram WebApp
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Инициализируем WebApp
      tg.ready();

      // Расширяем на весь экран
      tg.expand();

      // Включаем подтверждение при закрытии
      tg.enableClosingConfirmation();

      // Отключаем закрытие свайпом (доступно с версии v7.7)
      tg.postEvent("web_app_setup_swipe_behavior", { allow_vertical_swipe: false });

      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);
      setIsTelegramApp(true);

      console.log("Telegram WebApp initialized:", {
        user: tg.initDataUnsafe?.user,
        platform: tg.platform,
        version: tg.version,
        colorScheme: tg.colorScheme,
      });

      // Дополнительная защита: предотвращаем pull-to-refresh и overscroll
      const preventPullToRefresh = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const scrollable = target.closest('[style*="overflow"]') || target.closest('[style*="scroll"]');

        if (!scrollable && window.scrollY === 0) {
          e.preventDefault();
        }
      };

      document.addEventListener("touchstart", preventPullToRefresh, { passive: false });
      document.addEventListener("touchmove", preventPullToRefresh, { passive: false });

      return () => {
        document.removeEventListener("touchstart", preventPullToRefresh);
        document.removeEventListener("touchmove", preventPullToRefresh);
      };
    } else {
      console.warn("Telegram WebApp is not available");
      // В режиме разработки можно использовать mock данные
      if (import.meta.env.DEV) {
        setUser({
          id: 12345678,
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          language_code: "ru",
        });
        setIsReady(true);
        setIsTelegramApp(false);
      }
    }
  }, []);

  const showBackButton = (onClick?: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.show();
      if (onClick) {
        webApp.BackButton.onClick(onClick);
      }
    }
  };

  const hideBackButton = () => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
    }
  };

  const showMainButton = (text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
      webApp.MainButton.show();
      webApp.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
    }
  };

  const hapticFeedback = {
    impact: (style: "light" | "medium" | "heavy" = "medium") => {
      webApp?.HapticFeedback.impactOccurred(style);
    },
    notification: (type: "error" | "success" | "warning") => {
      webApp?.HapticFeedback.notificationOccurred(type);
    },
    selection: () => {
      webApp?.HapticFeedback.selectionChanged();
    },
  };

  const close = () => {
    webApp?.close();
  };

  const openLink = (url: string) => {
    webApp?.openLink(url);
  };

  const showAlert = (message: string) => {
    return new Promise<void>((resolve) => {
      webApp?.showAlert(message, () => resolve());
    });
  };

  const showConfirm = (message: string) => {
    return new Promise<boolean>((resolve) => {
      webApp?.showConfirm(message, (confirmed) => resolve(confirmed));
    });
  };

  return {
    webApp,
    user,
    isReady,
    isTelegramApp,
    showBackButton,
    hideBackButton,
    showMainButton,
    hideMainButton,
    hapticFeedback,
    close,
    openLink,
    showAlert,
    showConfirm,
  };
};
