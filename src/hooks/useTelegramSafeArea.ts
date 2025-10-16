import { useState, useEffect } from "react";
import { getTG, isTelegramApp } from "@/lib/telegram";

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Хук для получения safe area insets из Telegram WebApp API
 * Возвращает актуальные отступы для безопасной области
 */
export const useTelegramSafeArea = () => {
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    if (!isTelegramApp()) {
      return;
    }

    const tg = getTG();
    if (!tg) {
      return;
    }

    // Получаем safe area insets из Telegram
    // contentSafeAreaInset учитывает header и другие элементы UI Telegram
    const insets = tg.contentSafeAreaInset || tg.safeAreaInset;

    if (insets) {
      setSafeAreaInsets({
        top: insets.top || 0,
        bottom: insets.bottom || 0,
        left: insets.left || 0,
        right: insets.right || 0,
      });
    }
  }, []);

  return safeAreaInsets;
};

/**
 * Хук для получения правильного paddingTop с учетом safe area
 * @param defaultPaddingTelegram - дефолтный отступ для Telegram (если safe area недоступен)
 * @param defaultPaddingWeb - дефолтный отступ для веба
 */
export const useSafePaddingTop = (
  defaultPaddingTelegram = 92,
  defaultPaddingWeb = 46,
) => {
  const isTelegram = isTelegramApp();
  const safeArea = useTelegramSafeArea();

  if (!isTelegram) {
    return defaultPaddingWeb;
  }

  // Если safe area доступен, используем его + небольшой базовый отступ
  // Иначе используем дефолтный отступ
  return safeArea.top > 0 ? defaultPaddingTelegram : safeArea.top + 44;
};
