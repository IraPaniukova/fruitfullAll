import { createTheme } from "@mui/material/styles";
import { mainColour } from "../../../utils/constants";

//light theme is a default mui theme, but also sets orange element for both - light and dark
export const lightTheme = createTheme({
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecorationColor: mainColour, //The colour used in Buttons
          color: mainColour,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
          },
          "&:focusVisible": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50%", // Round edges
          aspectRatio: "1 / 1",
          minWidth: "50px",
          color: "white",
          // border: "5px solid #1b5e20",
        },
        containedPrimary: {
          backgroundColor: mainColour,
          "&:hover": {
            backgroundColor: " #ff8c00",
            boxShadow: "0 4px 4px rgba(27, 94, 32, 1) !important", // #1b5e20
          },
          "&:focus": {
            outline: "none",
          },
          "&:focusVisible": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
      defaultProps: {
        variant: "contained", // Default button style
      },
    },
    // MuiRadio: {
    //   styleOverrides: {
    //     root: {
    //       "&.Mui-checked": {
    //         color: mainColour,
    //       },
    //     },
    //   },
    // },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       "& .MuiInputLabel-root.Mui-focused": {
    //         color: mainColour,
    //       },
    //     },
    //   },
    // },
  },
});
