import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import authReducer from "../features/auth/authSlice";
import commentsReducer from "../features/comments/commentsSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const accessToken = (state: RootState) => state.auth.accessToken;
export type AppDispatch = typeof store.dispatch;
