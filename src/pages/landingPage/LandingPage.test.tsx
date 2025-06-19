import { cleanup, screen } from '@testing-library/react';
import { LandingPage } from './LandingPage';
import { TestRenderForPages } from '../../utils/TestRenderForPages';

describe('LandingPage', () => {
    beforeEach(() => {
        TestRenderForPages(<LandingPage />, { theme: 'light' });
    });
    afterEach(() => {
        cleanup();
    });

    it('renders logo image with correct alt text', () => {
        const logo = screen.getByAltText('logo')
        expect(logo).toBeInTheDocument()
    })

    it('renders the try it button', () => {
        const button = screen.getByRole('link', { name: /try it/i })
        expect(button).toBeInTheDocument()
    })

    it('renders the first line of the text', () => {
        const heading = screen.getByText(/Where career starts/i)
        expect(heading).toBeInTheDocument()
    })

    it('renders the subheading', () => {
        const subheading = screen.getByText(/Share and discuss real interview questions and tips/i)
        expect(subheading).toBeInTheDocument()
    })
})
