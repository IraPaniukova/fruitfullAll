import { createTheme } from "@mui/material/styles";
import { lightTheme } from "./lightTheme";

export const darkTheme = createTheme({
  ...lightTheme,
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
});
