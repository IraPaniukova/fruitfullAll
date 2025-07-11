import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, ListItemText } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link, useLocation } from 'react-router-dom';
import { logoutThunk } from "../../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from '../../store/typeHooks';



const pages = [
    { name: 'Dashboard', path: '/' },
];

export const UserMenu = () => {
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);


    const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const dispatch = useAppDispatch();
    const refreshToken = useAppSelector(state => state.auth.refreshToken);

    const handleLogout = () => {
        dispatch(logoutThunk(refreshToken!));
        handleClose();
    };

    const menuPages = pages.filter(page => page.path !== location.pathname);

    return (
        <>
            <IconButton
                onClick={handleOpen}
                size="small"
                aria-controls={open ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ pt: 4 }}
            >
                <ArrowDropDownIcon />
            </IconButton>

            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
            >
                {menuPages.map(page => (
                    <MenuItem
                        key={page.path}
                        component={Link}
                        to={page.path}
                        onClick={handleClose}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemText>{page.name}</ListItemText>
                    </MenuItem>
                ))}

                <MenuItem onClick={handleLogout}>
                    <ListItemText>Log out</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};
