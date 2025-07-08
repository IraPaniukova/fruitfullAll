
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from './features/theme/themeConfig/lightTheme';
import { darkTheme } from './features/theme/themeConfig/darkTheme';
import { useAppDispatch, useAppSelector } from './store/typeHooks';
import { Box } from '@mui/material';
import { ToggleThemeButton } from './features/theme/components/ToggleThemeButton';
import { AppRouter } from './app/AppRouter';
import { refreshTokenThunk } from "./features/auth/authThunks";
import { useEffect } from 'react';
import { login } from "./features/auth/authSlice";


function App() {
  const mode = useAppSelector((state) => state.theme);
  const theme = createTheme(mode === "light" ? lightTheme : darkTheme);
  const dispatch = useAppDispatch();

  // const dispatch = useAppDispatch();
  // const mode = useAppSelector((state) => state.theme);

  // useEffect(() => {
  //   async function fetchTheme() {
  //     try {
  //       const userData = await getUserMe(); // e.g. returns "light" or "dark"
  //       dispatch(setTheme(userData?.theme));
  //     } catch (error) {
  //       console.error("Failed to fetch theme:", error);
  //     }
  //   }
  //   fetchTheme();
  // }, [dispatch]);

  // // now mode has DB value or default if fetch fails
  // // use mode as usual:
  // const theme = createTheme(mode === "light" ? lightTheme : darkTheme);

  // // const dispatch = useAppDispatch();
  // // const mode = useAppSelector((state) => state.theme);

  // // useEffect(() => {
  // //   async function loadTheme() {
  // //     try {
  // //       const userData = await getUserMe();
  // //       if (userData?.theme) {
  // //         dispatch(setTheme(userData.theme)); // update Redux state with theme from DB
  // //       }
  // //     } catch {
  // //       // handle error or ignore
  // //     }
  // //   }
  // //   loadTheme();
  // // }, [dispatch]);




  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      dispatch(
        login({
          token: accessToken,          // must be 'token'
          refreshToken: refreshToken,
        })
      );
    }
  }, [dispatch]);


  //Sets request to refresh token every 25 minutes, because the token set to 30 min in the backend
  useEffect(() => {
    const intervalId = setInterval(() => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        dispatch(refreshTokenThunk(refreshToken));
      }
    }, 1 * 60 * 1000); // every 25 minutes

    return () => clearInterval(intervalId);
  }, [dispatch]);


  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <AppRouter />
        <Box zIndex={1}> <ToggleThemeButton /></Box>
      </>
    </ThemeProvider>
  )
}

export default App

