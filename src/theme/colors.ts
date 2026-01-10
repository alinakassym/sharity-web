// sharity-web/src/theme/colors.ts

const primaryColor = "#907BE2";
const accentColor = "#00ECBE";
const darkenColor = "#1E1A29";
const darkColor = "#29243A";
const darkenGrayColor = "#898989";
const darkGrayColor = "#ADADAD";
const grayColor = "#F5F2F2";
const borderColor = "#D3D3D3";
const lighterColor = "#FFFFFF";
const redColor = "#EC002F";

export const Colors = {
  light: {
    primary: primaryColor,
    accent: accentColor,
    darken: darkenColor,
    lighter: lighterColor,
    text: darkenColor,
    lightText: darkenGrayColor,
    background: "#FFFFFF",
    surfaceColor: "#F0EDE6",
    opacity: "rgba(30, 26, 41, 0.1)",
    tint: primaryColor,
    icon: grayColor,
    tabIconDefault: grayColor,
    tabIconSelected: primaryColor,
    border: borderColor,
    muiBorder: "rgba(0, 0, 0, 0.23)",
    controlColor: "#F5F2F2",
    error: redColor,
  },
  dark: {
    primary: primaryColor,
    accent: accentColor,
    darken: darkenColor,
    lighter: lighterColor,
    text: "#FFFFFF",
    lightText: darkGrayColor,
    background: darkenColor,
    surfaceColor: darkColor,
    opacity: "rgba(255, 255, 255, 0.12)",
    tint: primaryColor,
    icon: grayColor,
    tabIconDefault: grayColor,
    tabIconSelected: primaryColor,
    border: "#898989",
    muiBorder: "rgba(255, 255, 255, 0.23)",
    controlColor: "#4B465A",
    error: redColor,
  },
} as const;
