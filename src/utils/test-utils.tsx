import React, { type PropsWithChildren, type Reducer } from 'react';
import { render as rtlRender, type RenderOptions, type RenderResult } from '@testing-library/react';
import { configureStore, type UnknownAction } from "@reduxjs/toolkit";
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MemoryRouter } from 'react-router-dom';

import { lightTheme } from '../features/theme/themeConfig/lightTheme';
import { darkTheme } from '../features/theme/themeConfig/darkTheme';

import themeReducer from '../features/theme/themeSlice';
import authReducer, { type AuthState } from '../features/auth/authSlice';
import commentsReducer, { type CommentsState } from '../features/comments/commentsSlice';
import type { RootState } from '../store/store';

import { useAppDispatch, useAppSelector } from '../store/typeHooks';

import { AppRouter } from '../app/AppRouter';

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      theme: themeReducer as Reducer<string | undefined, UnknownAction>,
      auth: authReducer as Reducer<AuthState | undefined, UnknownAction>,
      comments: commentsReducer as Reducer<CommentsState | undefined, UnknownAction>,
    },
    preloadedState,
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof setupStore>;
  initialEntries?: string[];
  initialIndex?: number;
  route?: string;
  themeMode?: 'light' | 'dark';
}

export function render(
  ui: React.ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    initialEntries = ['/'],
    initialIndex = 0,
    route,
    themeMode = 'light',
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult & { store: ReturnType<typeof setupStore> } {
  if (route) {
    initialEntries = [route];
  }

  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  const GOOGLE_CLIENT_ID_DUMMY = 'dummy-client-id-for-tests.apps.googleusercontent.com';




  const AllProviders = ({ children }: PropsWithChildren) => {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID_DUMMY}>
        <Provider store={store}>
          <ThemeProvider theme={currentTheme}>
            <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
              {children}
            </MemoryRouter>
          </ThemeProvider>
        </Provider>
      </GoogleOAuthProvider>
    );
  };

  const result = rtlRender(ui, { wrapper: AllProviders, ...renderOptions });

  return { ...result, store };
}

export * from '@testing-library/react';

export { useAppDispatch, useAppSelector };

export { AppRouter };