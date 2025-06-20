import { createTheme } from "@mui/material/styles";
import { sharedTheme } from "./sharedTheme";

export const lightTheme = createTheme({
  ...sharedTheme,
  palette: {
    background: {
      paper: "#E5E5E5", //E0E0E0,E5E5E5,DCDCDC
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#E5E5E5",
        },
      },
    },
  },
});
