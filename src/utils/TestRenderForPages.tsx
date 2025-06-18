import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import { MemoryRouter } from "react-router-dom";

export const TestRenderForPages = (
  component: React.ReactNode,
  preloadedState = { theme: "light" }
) => {
  const store = configureStore({
    reducer: { theme: themeReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </Provider>
  );
};
