import { createBrowserRouter, Outlet, ScrollRestoration, RouterProvider } from 'react-router-dom';
import { Stack } from '@mui/material';
import { DashboardPage } from '../pages/dashboardPage/DashboardPage';
import { AuthPage } from '../pages/authPage/AuthPage';
import { LandingPage } from '../pages/landingPage/LandingPage';
import { ProfilePage } from '../pages/profilePage/ProfilePage';
import { Header } from '../components/header/Header';
import { Navigate } from 'react-router-dom';
import { PostPage } from '../pages/postPage/PostPage';
import { UpdatePostPage } from '../pages/updatePostPage/UpdatePostPage';
import { CreatePostPage } from '../pages/createPostPage/CreatePostPage';
import { NotFoundPage } from '../pages/notFoundPage/NotFoundPage';
import { useAppSelector } from '../store/typeHooks';
import { useEffect, useState } from 'react';
import { UserPostsPage } from '../pages/userPostsPage/UserPostsPage';



export const AppRouter = () => {
    type PrivateRouteProps = {
        component: React.ComponentType;
    };

    const loggedIn = useAppSelector(state => !!state.auth.accessToken);

    const PrivateRoute = ({ component: Component }: PrivateRouteProps) => {
        const [isReady, setIsReady] = useState(false);

        useEffect(() => {
            setIsReady(true); // Delays rendering for Redux to ensure loading of accurate state
        }, []);

        if (!isReady) return null;
        return loggedIn ? <Component /> : <Navigate to="/" replace />;
    };
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
                { path: 'auth', element: !loggedIn ? <AuthPage /> : < Navigate to="/" replace /> },
                { path: 'profile', element: <PrivateRoute component={ProfilePage} /> },
                { path: 'posts/create', element: <PrivateRoute component={CreatePostPage} /> },
                { path: 'posts/update/:id', element: <PrivateRoute component={UpdatePostPage} /> },
                { path: 'posts/:id', element: <PrivateRoute component={PostPage} /> },
                { path: 'posts/me', element: <PrivateRoute component={UserPostsPage} /> },
                { path: '*', element: <NotFoundPage /> }
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

