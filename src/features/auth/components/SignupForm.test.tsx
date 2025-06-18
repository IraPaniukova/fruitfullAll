import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SignupForm } from './SignupForm';
import userEvent from '@testing-library/user-event';

describe('SignupForm', () => {
    const validInput = async (label: string, input: string) => {
        const emailInput = screen.getByLabelText(label);
        await userEvent.type(emailInput, input);
        const joinButton = screen.getByRole('button', { name: /Join/i });
        expect(joinButton).toBeInTheDocument();
        await userEvent.click(joinButton);
    }

    beforeEach(() => {
        render(<SignupForm />);
    });
    it('renders email input', () => {
        expect(screen.getByRole('textbox', { name: /Email/i })).toBeInTheDocument();
    });

    it('renders password input', () => {
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
    it('renders Sign up title', () => {
        expect(screen.getByRole('heading', { name: /Sign up/i })).toBeInTheDocument();
    });

    it('on Join button click it renders error if email is not valid', async () => {
        await validInput('Email', 'wrong email');
        expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
    });
    it('on Join button click it doesnt render error if email is valid', async () => {
        await validInput('Email', 'proper@email.com');
        expect(screen.queryByText(/Enter a valid email/i)).not.toBeInTheDocument();
    });
    it('on Join button click it renders error if password is not valid', async () => {
        await validInput('Password', 'wrong password');
        expect(screen.getByText(/At least 1 uppercase, 1 lowercase, 1 symbol, 8 characters/i)).toBeInTheDocument();
    });
    it('on Join button click it doesnt render error if password is valid', async () => {
        await validInput('Password', 'ProperP@ssword1');
        expect(screen.queryByText(/At least 1 uppercase, 1 lowercase, 1 symbol, 8 characters/i)).not.toBeInTheDocument();
    });
});
