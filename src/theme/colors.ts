const primaryColor = "#907BE2";
const accentColor = "#00ECBD";
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
    tint: primaryColor,
    icon: grayColor,
    tabIconDefault: grayColor,
    tabIconSelected: primaryColor,
    border: borderColor,
    buttonColor: "#F5F2F2",
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
    tint: primaryColor,
    icon: grayColor,
    tabIconDefault: grayColor,
    tabIconSelected: primaryColor,
    border: "#898989",
    buttonColor: "#4B465A",
    error: redColor,
  },
} as const;
