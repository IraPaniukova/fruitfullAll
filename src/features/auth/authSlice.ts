import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponseDto } from "../../utils/interfaces";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthResponseDto>) => {
      state.accessToken = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
