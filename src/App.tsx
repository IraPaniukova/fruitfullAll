
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from './features/theme/themeConfig/lightTheme';
import { darkTheme } from './features/theme/themeConfig/darkTheme';
import { useAppSelector } from './store/typeHooks';
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom'
import { Stack } from '@mui/material';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/authPage/AuthPage';
import { HomePage } from './pages/HomePage';
import { Box } from '@mui/material';
import { ThemeToggleButton } from './features/theme/components/ThemeToggleButton';

function App() {
  const mode = useAppSelector((state) => state.theme);
  const theme = createTheme(mode === "light" ? lightTheme : darkTheme);
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
        { path: '', element: <LandingPage /> },
        { path: 'auth', element: <AuthPage /> },
        { path: 'home', element: <HomePage /> }
        // { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);
  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <RouterProvider router={router} />
        <Box zIndex={1}> <ThemeToggleButton /></Box>
      </>
    </ThemeProvider>
  )
}

export default App

