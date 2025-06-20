import { createBrowserRouter, Outlet, ScrollRestoration, RouterProvider } from 'react-router-dom';
import { Stack } from '@mui/material';
import { DashboardPage } from '../pages/dashboardPage/DashboardPage';
import { AuthPage } from '../pages/authPage/AuthPage';
import { LandingPage } from '../pages/landingPage/LandingPage';
import { ProfilePage } from '../pages/profilePage/ProfilePage';
import { Header } from '../components/header/Header';
import { Navigate } from 'react-router-dom';
import { PostPage } from '../pages/postPage/PostPage';
import { CreatePostPage } from '../pages/createPostPage/CreatePostPage';


type Props = {
    loggedIn: boolean;
};

export const AppRouter = ({ loggedIn }: Props) => {

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <Stack>
                    <Header loggedIn={loggedIn} />
                    <Outlet />
                    <ScrollRestoration />
                </Stack>
            ),
            children: [
                { path: '', element: loggedIn ? <DashboardPage /> : <LandingPage /> },
                { path: 'auth', element: <AuthPage /> },
                {
                    path: 'profile', element: loggedIn ?
                        <ProfilePage /> : < Navigate to="/" replace />
                },
                {
                    path: '/create', element: loggedIn ?
                        <CreatePostPage /> : < Navigate to="/" replace />
                },
                {
                    path: '/posts/:id', element: loggedIn ?
                        <PostPage /> : < Navigate to="/" replace />
                }

            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

