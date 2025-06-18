
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from './features/theme/themeConfig/lightTheme';
import { darkTheme } from './features/theme/themeConfig/darkTheme';
import { useAppSelector } from './store/typeHooks';
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom'
import { Stack } from '@mui/material';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { Box } from '@mui/material';
import { ThemeToggleButton } from './features/theme/components/ThemeToggleButton';
import { INACTIVITY_TIME } from './utils/constants';
import { ActivityDetector } from './features/auth/components/ActivityDetector';

function App() {
  const mode = useAppSelector((state) => state.theme);
  const theme = createTheme(mode === "light" ? lightTheme : darkTheme);
  const loggedIn = useAppSelector(state => {
    const user = state.auth.user;
    const loginTime = state.auth.loginTime;
    return user != null && loginTime != null && (Date.now() - loginTime < INACTIVITY_TIME);
  });
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Stack  >
          {/* all components that contain links to other pages mast be inside Router tag */}
          <Outlet />
          <ScrollRestoration />
        </Stack>
      ),
      children: [
        { path: '', element: loggedIn ? <HomePage /> : <LandingPage /> },
        { path: 'auth', element: <AuthPage /> },
        // { path: 'user', element: <UserPage /> }
        // { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);
  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <ActivityDetector />
        <RouterProvider router={router} />
        <Box zIndex={1}> <ThemeToggleButton /></Box>
      </>
    </ThemeProvider>
  )
}

export default App

