import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";

export const renderWithStoreAndThemeTestUtil = (
  component: React.ReactNode,
  preloadedState = { theme: "light" }
) => {
  const store = configureStore({
    reducer: { theme: themeReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};
