import { createSlice } from "@reduxjs/toolkit";
import { userEmail, userTimeStamp } from "../TEMP-DATA/TEMP_DATA";

interface AuthState {
  user: string | null;
  loginTime: number | null;
}
const initialState: AuthState = {
  //from DB
  user: userEmail,
  loginTime: userTimeStamp,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateLastActivity: (state, action) => {
      state.loginTime = action.payload;
    },
  },
});

export const { login, logout, updateLastActivity } = authSlice.actions;
export default authSlice.reducer;
