import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../themeSlice';
import { ThemeToggleButton } from './ThemeToggleButton';

const renderWithTheme = (initialTheme: string) => {
    const store = configureStore({
        reducer: { theme: themeReducer },
        preloadedState: { theme: initialTheme },
    });

    return {
        ...render(
            <Provider store={store}>
                <ThemeToggleButton />
            </Provider>
        ),
        store,
    };
};

describe('ThemeToggleButton', () => {
    it('shows dark mode icon when theme is light', () => {
        renderWithTheme('light');
        expect(screen.getByLabelText(/switch to dark mode/i)).toBeInTheDocument();
    });

    it('shows light mode icon when theme is dark', () => {
        renderWithTheme('dark');
        expect(screen.getByLabelText(/switch to light mode/i)).toBeInTheDocument();
    });

    it('toggles theme on click', () => {
        const { store } = renderWithTheme('light');
        const button = screen.getByRole('button');

        fireEvent.click(button);
        expect(store.getState().theme).toBe('dark');

        fireEvent.click(button);
        expect(store.getState().theme).toBe('light');
    });
});
