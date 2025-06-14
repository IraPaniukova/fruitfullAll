
import logo from './assets/fruitfull_logo.png'
// import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
// import lightTheme from './muiTheme/lightTheme';
// import darkTheme from './muiTheme/darkTheme';

import './App.css'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from './features/theme/themeConfig/lightTheme';
import { darkTheme } from './features/theme/themeConfig/darkTheme';
// import type { RootState } from './store';

function App() {
  // const currentTheme = useSelector((state: RootState) => state.theme);
  // const muiTheme = currentTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={darkTheme}>
      <>
        <CssBaseline />
        <div>
          Future app <img src={logo} alt='logo' height='100px' />
          <Button>try it</Button>
        </div>
      </>
    </ThemeProvider>
  )
}

export default App
