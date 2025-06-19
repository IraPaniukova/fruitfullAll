import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthPage } from './AuthPage';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
    beforeEach(() => {
        render(<AuthPage />);
    });
    it('renders text Go to Sign up on first load', () => {
        expect(screen.getByText(/Go to Sign up/i)).toBeInTheDocument();
    });
    it('renders text Login after user clicks Go to Sign up', async () => {
        const button = screen.getByRole('button', { name: (/Go to Sign up/i) });
        expect(button).toBeInTheDocument();
        await userEvent.click(button);
        expect(screen.getByText(/Go to Login/i)).toBeInTheDocument();
    });

});
