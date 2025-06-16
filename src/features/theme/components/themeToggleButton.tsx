import { IconButton } from "@mui/material";
import { toggleTheme } from "../themeSlice";
import { useAppDispatch, useAppSelector } from "../../../store/typeHooks";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export const ThemeToggleButton = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.theme);
    //it should save new themeMode in DB on change:
    // const handleToggle = async () => {
    //     dispatch(toggleTheme()); // update Redux 
    //     try {
    //         const newMode = mode === "dark" ? "light" : "dark";
    //         await api.saveTheme(newMode); // call your API to save theme in DB
    //     } catch (error) {
    //         // Optionally revert state or show error
    //         dispatch(toggleTheme()); // revert Redux if needed
    //     }
    //   };
    return (
        <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
            {mode === "dark" ?
                <LightModeIcon aria-label="Switch to light mode" /> :
                <DarkModeIcon aria-label="Switch to dark mode" />}
        </IconButton>
    );
};
