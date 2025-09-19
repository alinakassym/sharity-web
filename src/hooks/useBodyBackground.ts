import { useEffect } from "react";
import { useColorScheme } from "./useColorScheme";
import { Colors } from "../theme/colors";

export function useBodyBackground() {
  const scheme = useColorScheme();

  useEffect(() => {
    const backgroundColor = Colors[scheme].background;
    document.body.style.backgroundColor = backgroundColor;

    // Cleanup function to reset when component unmounts
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [scheme]);
}
