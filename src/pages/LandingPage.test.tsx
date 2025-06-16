import { render, screen } from '@testing-library/react';
import { LandingPage } from './LandingPage';

describe('LandingPage', () => {
    it('renders logo image with correct alt text', () => {
        render(<LandingPage />)
        const logo = screen.getByAltText('logo')
        expect(logo).toBeInTheDocument()
    })

    it('renders the try it button', () => {
        render(<LandingPage />)
        const button = screen.getByRole('button', { name: /try it/i })
        expect(button).toBeInTheDocument()
    })

    it('renders the first line of the text', () => {
        render(<LandingPage />)
        const heading = screen.getByText(/Where career starts/i)
        expect(heading).toBeInTheDocument()
    })

    it('renders the subheading', () => {
        render(<LandingPage />)
        const subheading = screen.getByText(/Share and discuss real interview questions and tips/i)
        expect(subheading).toBeInTheDocument()
    })
})
