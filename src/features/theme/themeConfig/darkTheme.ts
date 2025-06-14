import { createTheme } from "@mui/material/styles";
import { lightTheme } from "./lightTheme";

export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: "dark",
    // primary: {
    //   main: "#90caf9", // light blue
    // },
    background: {
      default: "#121212",
      paper: "#333333",
    },
    text: {
      primary: "#E0E0E0", // light text
      secondary: "#bdbdbd",
    },
  },
});
