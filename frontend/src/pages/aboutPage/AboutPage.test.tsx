import { render, screen, fireEvent } from '../../utils/test-utils';
import { AboutPage } from './AboutPage';

//doesnt work even though the whole setup looks correct
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual, // Keeps original react-router-dom exports, mocks only useNavigate
        useNavigate: () => mockNavigate,
    };
});

describe('AboutPage', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test('renders page content and "Back" button when user is logged out (default state)', () => {
        render(<AboutPage />);

        expect(screen.getByRole('heading', { name: /welcome to fruitfull!/i })).toBeInTheDocument();
        expect(screen.getByText(/fruitfull is your go-to space to explore, discuss, and master interview questions./i)).toBeInTheDocument();
        expect(screen.getByText(/join the conversation and boost your interview skills today!/i)).toBeInTheDocument();

        expect(screen.getByAltText('logo')).toBeInTheDocument();

        const backButton = screen.getByRole('button', { name: /back/i });
        expect(backButton).toBeInTheDocument();
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('renders page content but does NOT show "Back" button when user is logged in', () => {
        render(<AboutPage />, {
            preloadedState: {
                auth: {
                    accessToken: 'mock_access_token_123',
                    refreshToken: 'mock_refresh_token_456',
                    userId: 789,
                },
                comments: {
                    comments: [],
                },
                theme: 'light',
            },
        });

        expect(screen.getByRole('heading', { name: /welcome to fruitfull!/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    });
});