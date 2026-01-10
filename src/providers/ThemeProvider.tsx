// sharity-web/src/providers/ThemeProvider.tsx

import type { FC, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useColorScheme } from "../hooks/useColorScheme";
import { createCustomMuiTheme } from "../theme/muiTheme";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const muiTheme = createCustomMuiTheme(colorScheme);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
