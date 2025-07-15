import React, { type JSX, type PropsWithChildren } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import themeReducer from '../features/theme/themeSlice';
import authReducer from '../features/auth/authSlice';
import commentsReducer from '../features/comments/commentsSlice';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Combined reducer map that directly mirrors the 'reducer' objects in actual store.ts:
const testReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  comments: commentsReducer,
});

// For type inference: A temporary store matching app's main store structure:
const tempTestStore = configureStore({
  reducer: testReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Make sure that test store matches app's store for correct type checking:
export type TestRootState = ReturnType<typeof tempTestStore.getState>;
export type TestAppDispatch = typeof tempTestStore.dispatch;


// Sets the custom initial Redux state and store for specific tests:
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<TestRootState>; // For starting the Redux store with specific data.
  store?: typeof tempTestStore; // Or, gives your own Redux store for the test.
}

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Creates a new store instance for each test run by default, matching your app's setup
    store = configureStore({
      reducer: testReducer, // Uses combined reducer
      preloadedState,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Ensures middleware setup
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  // Wrapper component that includes the Google,  Redux Provider and React Router's MemoryRouter
  const Wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return (
      <GoogleOAuthProvider clientId="test">
        <Provider store={store}>
          <MemoryRouter>{children}</MemoryRouter>
        </Provider>
      </GoogleOAuthProvider>
    );
  };

  // Returns the store instance along with all of React Testing Library's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Re-export everything from @testing-library/react so you can import them from this file
export * from '@testing-library/react';

// Override the default render export with your custom renderWithProviders function
export { renderWithProviders as render };
