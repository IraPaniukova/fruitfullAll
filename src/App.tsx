
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from './features/theme/themeConfig/lightTheme';
import { darkTheme } from './features/theme/themeConfig/darkTheme';
import { useAppDispatch, useAppSelector } from './store/typeHooks';
import { login } from "./features/auth/authSlice";
import { getUserMe } from './api/userApi';
import { setTheme } from './features/theme/themeSlice';
import { AppRouter } from './app/AppRouter';
import { useEffect } from 'react';



function App() {
  const mode = useAppSelector((state) => state.theme);
  const theme = createTheme(mode === "light" ? lightTheme : darkTheme);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(state => state.auth.accessToken);
  const loggedIn = useAppSelector(state => !!state.auth.accessToken);
  useEffect(() => {
    if (!loggedIn) return;
    const fetchTheme = async () => {
      try {
        const userData = await getUserMe();
        if (userData?.theme) {
          dispatch(setTheme(userData.theme));
        } else {
          dispatch(setTheme("light")); // fallback if no theme in user data
        }
      } catch (error) {
        dispatch(setTheme("light")); // fallback on error
      }
    }
    fetchTheme();
  }, [accessToken, dispatch]);


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      dispatch(
        login({
          token: accessToken,
          refreshToken: refreshToken,
          userId: Number(localStorage.getItem("userId")) || 0,
          expiresAt: new Date(new Date().setUTCDate(new Date().getUTCDate() + 7)).toISOString()
        })
      );
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <AppRouter />
      </>
    </ThemeProvider>
  )
}

export default App

