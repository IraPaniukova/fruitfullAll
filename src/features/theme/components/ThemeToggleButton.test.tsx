import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggleButton } from './ThemeToggleButton';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../themeSlice';
import { renderWithStoreAndThemeTestUtil } from '../../../utils/renderWithStoreAndThemeTestUtil';

describe('ThemeToggleButton', () => {
    it('shows dark mode icon when theme is light', () => {
        renderWithStoreAndThemeTestUtil(<ThemeToggleButton />, { theme: 'light' });
        expect(screen.getByLabelText(/Switch to dark mode/i)).toBeInTheDocument();
    });

    it('shows light mode icon when theme is dark', () => {
        renderWithStoreAndThemeTestUtil(<ThemeToggleButton />, { theme: 'dark' });
        expect(screen.getByLabelText(/Switch to light mode/i)).toBeInTheDocument();
    });

    it('toggles theme on click', () => {
        const store = configureStore({
            reducer: { theme: themeReducer },
            preloadedState: { theme: 'light' },
        });

        render(
            <Provider store={store}>
                <ThemeToggleButton />
            </Provider>
        );

        fireEvent.click(screen.getByRole('button'));
        expect(store.getState().theme).toBe('dark');
    });
});
