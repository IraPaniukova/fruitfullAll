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
import { NotFoundPage } from '../pages/notFoundPage/NotFoundPage';


type Props = {
    loggedIn: boolean;
};

export const AppRouter = ({ loggedIn }: Props) => {
    type PrivateRouteProps = {
        component: React.ComponentType;
    };
    const PrivateRoute = ({ component: Component }: PrivateRouteProps) => {
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
                { path: 'create', element: <PrivateRoute component={CreatePostPage} /> },
                { path: 'posts/:id', element: <PrivateRoute component={PostPage} /> },
                { path: '*', element: <NotFoundPage /> }
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

