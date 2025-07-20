import { createSlice } from "@reduxjs/toolkit";

const initialState: string = "light"; // default to light mode

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      return state === "light" ? "dark" : "light";
    },
    setTheme: (_state, action) => action.payload, // "light" or "dark"
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
