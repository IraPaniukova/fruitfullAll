import { createSlice } from "@reduxjs/toolkit";
import { themeMode } from "../TEMP-DATA/TEMP_DATA";

const themeSlice = createSlice({
  name: "theme",
  initialState: themeMode, // default to light mode
  reducers: {
    toggleTheme: (state) => {
      return state === "light" ? "dark" : "light";
    },
    setTheme: (_state, action) => action.payload, // "light" or "dark"
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
