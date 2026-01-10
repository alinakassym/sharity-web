// sharity-web/src/hooks/useColorScheme.ts

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __APP_THEME?: Scheme;
  }
}

type Scheme = "light" | "dark";

export function useColorScheme(defaultScheme: Scheme = "light"): Scheme {
  const get = (): Scheme => {
    const qs = new URLSearchParams(window.location.search).get(
      "theme",
    ) as Scheme | null;
    const global = window?.__APP_THEME as Scheme | undefined;
    const ls = (localStorage.getItem("APP_THEME") as Scheme | null) || null;
    const media = window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    return (qs || global || ls || media || defaultScheme) as Scheme;
  };
  const [scheme, setScheme] = useState<Scheme>(get());

  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = () => setScheme(mql.matches ? "dark" : "light");
    mql?.addEventListener?.("change", onChange);
    return () => mql?.removeEventListener?.("change", onChange);
  }, []);

  return scheme;
}
