import { IconButton } from "@mui/material";
import { toggleTheme } from "../themeSlice";
import { useAppDispatch, useAppSelector } from "../../../store/typeHooks";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const ThemeToggleButton = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.theme);

    return (
        <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
            {mode === "dark" ?
                <LightModeIcon sx={{ border: 'none' }} /> :
                <DarkModeIcon sx={{ border: 'none' }} />}
        </IconButton>
    );
};

export default ThemeToggleButton;
