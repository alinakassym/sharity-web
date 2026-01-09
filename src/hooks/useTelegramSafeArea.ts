// sharity-web/src/hooks/useTelegramSafeArea.ts

import { useState, useEffect } from "react";
import { getTG, isTelegramApp } from "@/lib/telegram";

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type PlatformType = "android" | "ios" | "desktop" | "web" | "unknown";

interface SafeAreaWithPlatform extends SafeAreaInsets {
  platform: PlatformType;
  platformRaw?: string; // Оригинальное значение от Telegram
}

/**
 * Определяет тип платформы на основе значения от Telegram
 */
const getPlatformType = (platform?: string): PlatformType => {
  if (!platform) return "unknown";

  const platformLower = platform.toLowerCase();

  if (platformLower === "android") return "android";
  if (platformLower === "ios") return "ios";
  if (["macos", "tdesktop", "unigram"].includes(platformLower))
    return "desktop";
  if (["web", "weba", "webk"].includes(platformLower)) return "web";

  return "unknown";
};

/**
 * Хук для получения safe area insets из Telegram WebApp API
 * Возвращает актуальные отступы для безопасной области + информацию о платформе
 */
export const useTelegramSafeArea = () => {
  const [safeAreaData, setSafeAreaData] = useState<SafeAreaWithPlatform>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    platform: "unknown",
    platformRaw: undefined,
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

    // Получаем информацию о платформе
    const platformRaw = tg.platform;
    const platform = getPlatformType(platformRaw);

    setSafeAreaData({
      top: insets?.top || 0,
      bottom: insets?.bottom || 0,
      left: insets?.left || 0,
      right: insets?.right || 0,
      platform,
      platformRaw,
    });
  }, []);

  return safeAreaData;
};

/**
 * Хук для получения правильного paddingTop с учетом safe area
 * @param defaultPaddingTelegram - дефолтный отступ для Telegram (если safe area недоступен)
 * @param defaultPaddingWeb - дефолтный отступ для веба
 */

export const useSafePlatform = () => {
  const safeAreaData = useTelegramSafeArea();

  return safeAreaData.platform;
};

export const useSafePaddingTop = (
  defaultPaddingTelegram = 48,
  defaultPaddingWeb = 0,
) => {
  const isTelegram = isTelegramApp();
  const safeAreaData = useTelegramSafeArea();
  if (!isTelegram) {
    return defaultPaddingWeb;
  }

  // Если safe area доступен, используем его + небольшой базовый отступ
  // Иначе используем дефолтный отступ
  return safeAreaData.top > 0 ? defaultPaddingTelegram : safeAreaData.top;
};
