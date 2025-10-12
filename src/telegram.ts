// Удобный helper, чтобы безопасно работать с Telegram WebApp
export function getTG() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any)?.Telegram?.WebApp as
    | {
        expand: () => void;
        ready: () => void;
        disableVerticalSwipes: () => void;
        enableVerticalSwipes: () => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
      }
    | undefined;
}
