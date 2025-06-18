
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from './features/theme/themeConfig/lightTheme';
import { darkTheme } from './features/theme/themeConfig/darkTheme';
import { useAppSelector } from './store/typeHooks';
import { Box } from '@mui/material';
import { ToggleThemeButton } from './features/theme/components/ToggleThemeButton';
import { ActivityDetector } from './features/auth/components/ActivityDetector';
import { INACTIVITY_TIME } from './utils/constants';
import { AppRouter } from './app/AppRouter';

function App() {
  const mode = useAppSelector((state) => state.theme);
  const theme = createTheme(mode === "light" ? lightTheme : darkTheme);
  const loggedIn = useAppSelector(state => {
    const user = state.auth.user;
    const loginTime = state.auth.loginTime;
    return user != null && loginTime != null && (Date.now() - loginTime < INACTIVITY_TIME);
  });


  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <ActivityDetector />
        <AppRouter loggedIn={loggedIn} />
        <Box zIndex={1}> <ToggleThemeButton /></Box>
      </>
    </ThemeProvider>
  )
}

export default App

