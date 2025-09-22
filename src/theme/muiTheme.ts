import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { Colors } from './colors';

type Scheme = "light" | "dark";

export const createCustomMuiTheme = (scheme: Scheme): Theme => {
  const colors = Colors[scheme];

  return createTheme({
    palette: {
      mode: scheme,
      primary: {
        main: colors.primary,
        contrastText: colors.lighter,
      },
      secondary: {
        main: colors.accent,
        contrastText: colors.text,
      },
      error: {
        main: colors.error,
        contrastText: colors.lighter,
      },
      background: {
        default: colors.background,
        paper: colors.surfaceColor,
      },
      text: {
        primary: colors.text,
        secondary: colors.lightText,
      },
      divider: colors.border,
      // Кастомные цвета для нашего приложения
      ...(scheme === "light"
        ? {
            grey: {
              50: "#fafafa",
              100: colors.controlColor,
              200: colors.border,
              300: colors.lightText,
              400: colors.lightText,
              500: colors.lightText,
              600: colors.text,
              700: colors.darken,
              800: colors.darken,
              900: colors.darken,
            },
          }
        : {
            grey: {
              50: colors.darken,
              100: colors.surfaceColor,
              200: colors.controlColor,
              300: colors.lightText,
              400: colors.lightText,
              500: colors.lightText,
              600: colors.text,
              700: colors.lighter,
              800: colors.lighter,
              900: colors.lighter,
            },
          }),
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      h1: {
        fontSize: "2rem",
        fontWeight: 600,
        color: colors.text,
      },
      h2: {
        fontSize: "1.5rem",
        fontWeight: 600,
        color: colors.text,
      },
      h3: {
        fontSize: "1.25rem",
        fontWeight: 600,
        color: colors.text,
      },
      h4: {
        fontSize: "1.125rem",
        fontWeight: 600,
        color: colors.text,
      },
      h5: {
        fontSize: "1rem",
        fontWeight: 600,
        color: colors.text,
      },
      h6: {
        fontSize: "0.875rem",
        fontWeight: 600,
        color: colors.text,
      },
      body1: {
        fontSize: "1rem",
        color: colors.text,
      },
      body2: {
        fontSize: "0.875rem",
        color: colors.lightText,
      },
    },
    components: {
      // Кастомизация MUI компонентов под наш дизайн
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "none",
            outline: "none",
            "&:focus": {
              outline: "none",
            },
          },
          containedPrimary: {
            backgroundColor: colors.primary,
            color: colors.lighter,
            "&:hover": {
              backgroundColor: colors.primary,
              opacity: 0.9,
            },
            "&:focus": {
              outline: "none",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              "& fieldset": {},
              "&:hover fieldset": {},
              "&.Mui-focused fieldset": {},
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: colors.surfaceColor,
            boxShadow: `0 1px 3px rgba(0,0,0,0.1)`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surfaceColor,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.background,
            color: colors.text,
            boxShadow: `0 1px 0 ${colors.surfaceColor}`,
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: colors.background,
            borderTop: `1px solid ${colors.surfaceColor}`,
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            color: colors.lightText,
            "&.Mui-selected": {
              color: colors.primary,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: colors.text,
            "&:hover": {
              backgroundColor: `${colors.primary}20`,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 24,
          },
          filled: {
            backgroundColor: colors.controlColor,
            color: colors.text,
          },
          filledPrimary: {
            backgroundColor: colors.primary,
            color: colors.lighter,
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
  });
};