
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from './features/theme/themeConfig/lightTheme';
import { darkTheme } from './features/theme/themeConfig/darkTheme';
import { useAppSelector } from './store/typeHooks';
import { LandingPage } from './pages/LandingPage';
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom'
import { Stack } from '@mui/material';


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
        // { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);
  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <RouterProvider router={router} />
      </>
    </ThemeProvider>
  )
}

export default App

