// sharity-web/src/components/CloseWebViewButton.tsx

import { useMemo } from "react";
import type { FC } from "react";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../theme/colors";
import VuesaxIcon from "./icons/VuesaxIcon";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const sendClose = () => {
  try {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "CLOSE_WEBVIEW" }),
    );
  } catch {
    console.warn("Failed to send CLOSE_WEBVIEW message to ReactNativeWebView");
  }
};

export const CloseWebViewButton: FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const isInRN = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => typeof window !== "undefined" && !!(window as any).ReactNativeWebView,
    [],
  );
  if (!isInRN) return null;

  return (
    <div
      onClick={sendClose}
      style={{
        marginRight: 9,
        marginLeft: 9,
        width: 22,
        height: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.accent,
      }}
    >
      <VuesaxIcon name="close" size={8} color={colors.accent} />
    </div>
  );
};
