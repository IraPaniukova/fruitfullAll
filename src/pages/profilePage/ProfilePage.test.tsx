import { describe, it, expect } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestRenderForPages } from '../../utils/TestRenderForPages';
import { ProfilePage } from './ProfilePage';

describe('ProfilePage', () => {
    beforeEach(() => {
        TestRenderForPages(<ProfilePage />, { theme: 'light' });
    });
    afterEach(() => {
        cleanup();
    });
    it('renders text Member Since', () => {
        expect(screen.getByText(/Member Since/i)).toBeInTheDocument();
    });
    it('calls onConfirmClick when clicked', async () => {
        const editButton = screen.getByLabelText(/Edit/i);
        await userEvent.click(editButton);
        expect(editButton).not.toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm changes/i)).toBeInTheDocument();
    });


});
