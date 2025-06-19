import { createBrowserRouter, Outlet, ScrollRestoration, RouterProvider } from 'react-router-dom';
import { Stack } from '@mui/material';
import { HomePage } from '../pages/homePage/HomePage';
import { AuthPage } from '../pages/authPage/AuthPage';
import { LandingPage } from '../pages/landingPage/LandingPage';
import { ProfilePage } from '../pages/profilePage/ProfilePage';
import { Header } from '../components/Header';

type Props = {
    loggedIn: boolean;
};

export const AppRouter = ({ loggedIn }: Props) => {
    ///need to solve useLocation here
    const showHeader = location.pathname !== '/auth' && !(location.pathname === '/' && !loggedIn);

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <Stack>
                    {showHeader && <Header />}
                    <Outlet />
                    <ScrollRestoration />
                </Stack>
            ),
            children: [
                { path: '', element: loggedIn ? <HomePage /> : <LandingPage /> },
                { path: 'auth', element: <AuthPage /> },
                { path: 'profile', element: loggedIn ? <ProfilePage /> : <LandingPage /> }
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

