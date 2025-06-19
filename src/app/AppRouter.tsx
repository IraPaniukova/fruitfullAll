import { createBrowserRouter, Outlet, ScrollRestoration, RouterProvider } from 'react-router-dom';
import { Stack } from '@mui/material';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';
import { LandingPage } from '../pages/LandingPage';
import { ProfilePage } from '../pages/ProfilePage';

type Props = {
    loggedIn: boolean;
};

export const AppRouter = ({ loggedIn }: Props) => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <Stack>
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

