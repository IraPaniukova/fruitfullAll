import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfilePage } from './ProfilePage';

describe('ProfilePage', () => {
    beforeEach(() => {
        render(<ProfilePage />);
    });
    it('renders text Member Since', () => {
        expect(screen.getByText(/Member Since/i)).toBeInTheDocument();
    });


});
