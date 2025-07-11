import { createTheme } from "@mui/material/styles";
import { mainColour } from "../../../utils/constants";

//light theme is a default mui theme, but also sets orange element for both - light and dark
export const lightTheme = createTheme({
  palette: {
    background: {
      paper: "#E5E5E5", //E0E0E0,E5E5E5,DCDCDC
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
          minWidth: "80px",
          color: "white",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
          "&:focus, &:focus-visible, &:active": {
            outline: "none",
            boxShadow: "none",
            border: "none",
          },
          // border: "5px solid #1b5e20",
        },
        containedPrimary: {
          backgroundColor: mainColour,
          "&:hover": {
            backgroundColor: " #ff8c00",
            boxShadow: "0 4px 4px rgba(27, 94, 32, 1) !important", // #1b5e20
          },
        },
      },
      defaultProps: {
        disableRipple: true,
        variant: "contained", // Default button style
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: `${mainColour}cc !important`, // override blue label color on focus
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${mainColour}cc !important`, // override blue border on focus
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${mainColour}cc !important`, // override blue border on autocomplete focus
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.Mui-focused::before": {
            borderBottomColor: `#FFA50033 !important`, // orange underline on focus
          },
          "&.Mui-focused::after": {
            borderBottomColor: `#FFA50033 !important`, // orange underline on focus
          },
        },
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
