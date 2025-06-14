
import logo from './assets/fruitfull_logo.png'
// import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import lightTheme from './muiTheme/lightTheme';
// import darkTheme from './muiTheme/darkTheme';

import './App.css'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from './features/theme/themeConfig/lightTheme';
import { darkTheme } from './features/theme/themeConfig/darkTheme';
import { useAppSelector } from './store/typeHooks';
import ThemeToggleButton from './features/theme/components/themeToggleButton';
// import type { RootState } from './store';

function App() {
  const mode = useAppSelector((state) => state.theme);
  const theme = createTheme(mode === "light" ? lightTheme : darkTheme);
  console.log("mode from Redux:", mode);
  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <div>
          Future app <img src={logo} alt='logo' height='100px' />
          <Button>try it</Button>
          <ThemeToggleButton />

        </div>
      </>
    </ThemeProvider>
  )
}

export default App
