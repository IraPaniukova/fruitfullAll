import type { AppDispatch } from "../../store/store";
import { login, logout } from "./authSlice";
import {
  login as loginApi,
  refreshToken as refreshTokenApi,
  logout as logoutApi,
  authWithGoogle as authWithGoogleApi,
} from "../../api/authApi";

export const loginThunk =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      const res = await loginApi({ email, password });
      dispatch(login(res));

      // Saves tokens to localStorage
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("userId", res.userId.toString());
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };
export const googleAuthThunk =
  (idToken: string) => async (dispatch: AppDispatch) => {
    try {
      const res = await authWithGoogleApi(idToken);
      dispatch(login(res));
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("userId", res.userId.toString());

      return res;
    } catch (err) {
      console.error("Google authentication failed in thunk:", err);
      throw err;
    }
  };

export const logoutThunk =
  (refreshToken: string) => async (dispatch: AppDispatch) => {
    try {
      await logoutApi(refreshToken);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logout());

      // Clears tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
    }
  };

export const refreshTokenThunk =
  (refreshToken: string) => async (dispatch: AppDispatch) => {
    try {
      const res = await refreshTokenApi(refreshToken);
      dispatch(login(res));

      // Updates tokens in localStorage
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("userId", res.userId.toString());
    } catch (err) {
      console.error("Refresh token failed:", err);
    }
  };
