import { createTheme } from "@mui/material/styles";

//light theme is a default mui theme, but also sets orange element for both - light and dark
export const lightTheme = createTheme({
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecorationColor: " #ff9800", //The colour used in Buttons
          color: " #ff9800",
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
          backgroundColor: " #ff9800",
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
    //         color: "#ff9800",
    //       },
    //     },
    //   },
    // },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       "& .MuiInputLabel-root.Mui-focused": {
    //         color: "#ff9800",
    //       },
    //     },
    //   },
    // },
  },
});
