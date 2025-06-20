import { createTheme } from "@mui/material/styles";
import { sharedTheme } from "./sharedTheme";

export const darkTheme = createTheme({
  ...sharedTheme,
  palette: {
    mode: "dark",
    background: {
      default: "#222222",
      paper: "#121212",
    },
    text: {
      primary: "#E0E0E0", // light text
      secondary: "#bdbdbd",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212",
        },
      },
    },
  },
});
