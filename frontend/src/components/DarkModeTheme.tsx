import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const CustomPalette = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode palette
        }
      : {
          // Dark mode palette
          primary: {
            main: "#88c0d0",
          },
          secondary: {
            // main: "#db7093",
            main: "#88dac1",
          },
          background: {
            default: "#282c34",
            paper: "#2e323b",
          },
          success: {
            main: "#a3be8c",
          },
          error: {
            main: "#e24d5b",
          },
          warning: {
            main: "#ebcb8b",
          },
          info: {
            main: "#81a1c1",
          },
          text: {
            primary: "#ffffff",
            secondary: "rgba(255,255,255, 0.85)",
            disabled: "rgba(255,255,255,0.5)",
            hint: "rgba(255,255,255, 0.5)",
          },
        }),
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

export const DarkModeTheme = createTheme(CustomPalette("dark"));

export const themeBackgroundColor = DarkModeTheme.palette.background.default;

export const themeSecondaryLightColor = DarkModeTheme.palette.secondary.light;

export const themeYellowColor = "#efd5a2";
