import axios from "axios";
import { store } from "../store/store";
import { logout } from "../features/auth/authSlice";
import { refreshTokenThunk } from "../features/auth/authThunks";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "api",
});

// Attaches access token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Responses interceptor handles 401 errors by trying to refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
  config: any;
}> = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      resolve(API(config));
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Handles 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        // Refreshes token via thunk, updates tokens in store/localStorage
        await store.dispatch(refreshTokenThunk(refreshToken) as any);

        const newAccessToken = localStorage.getItem("accessToken");
        if (!newAccessToken) {
          throw new Error("No new access token after refresh");
        }

        // Retries original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return API(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
