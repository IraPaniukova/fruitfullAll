import { IconButton, Tooltip } from "@mui/material";
import { toggleTheme } from "../themeSlice";
import { useAppDispatch, useAppSelector } from "../../../store/typeHooks";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { updateUser } from "../../../api/userApi";

export const ToggleThemeButton = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.theme);
    const accessToken = useAppSelector(state => state.auth.accessToken);

    const handleToggle = async () => {
        dispatch(toggleTheme());
        const newMode = mode === "dark" ? "light" : "dark";
        try {
            if (accessToken) await updateUser({ theme: newMode });  //saves user's theme to DB
        } catch (error) {
            console.error("Failed to update theme:", error);
        }
    };

    return (
        <Tooltip title="Change theme" placement="right">
            <IconButton onClick={handleToggle} color="inherit" aria-label="Change theme">
                {mode === "dark" ? (
                    <LightModeIcon aria-label="Switch to light mode" />
                ) : (
                    <DarkModeIcon aria-label="Switch to dark mode" />
                )}
            </IconButton>
        </Tooltip>
    );
};

