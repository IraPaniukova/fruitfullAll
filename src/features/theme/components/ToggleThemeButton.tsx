import { IconButton } from "@mui/material";
import { toggleTheme } from "../themeSlice";
import { useAppDispatch, useAppSelector } from "../../../store/typeHooks";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { updateUser } from "../../../api/userApi";

export const ToggleThemeButton = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.theme);

    const handleToggle = async () => {
        dispatch(toggleTheme());
        const newMode = mode === "dark" ? "light" : "dark";
        try {
            await updateUser({ theme: newMode });
        } catch (error) {
            console.error("Failed to update theme:", error);
        }
    };

    return (
        <IconButton onClick={handleToggle} color="inherit">
            {mode === "dark" ? (
                <LightModeIcon aria-label="Switch to light mode" />
            ) : (
                <DarkModeIcon aria-label="Switch to dark mode" />
            )}
        </IconButton>
    );
};

