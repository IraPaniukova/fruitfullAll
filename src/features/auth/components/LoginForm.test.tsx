import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
    beforeEach(() => {
        render(<LoginForm />);
    });
    it('renders email input', () => {
        expect(screen.getByRole('textbox', { name: /Email/i })).toBeInTheDocument();
    });

    it('renders password input', () => {
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
    it('renders Login title', () => {
        expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    });

    it('renders Login button', () => {
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });
});
