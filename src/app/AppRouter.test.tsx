// src/app/__tests__/AppRouter.test.tsx
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppRouter } from './AppRouter';

describe('AppRouter', () => {
    test('renders LandingPage when loggedIn is false', () => {
        render(<AppRouter loggedIn={false} />);
        expect(screen.getByText(/Share and discuss real interview questions and tips/i)).toBeInTheDocument();
    });

    test('renders HomePage when loggedIn is true', () => {
        render(<AppRouter loggedIn={true} />);
        // Replace with some unique text from HomePage
        expect(screen.getByText(/Not sure yet what exactly is here - top discussions probably/i)).toBeInTheDocument();
    });
});
