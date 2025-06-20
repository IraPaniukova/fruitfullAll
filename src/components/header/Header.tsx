import { alpha, AppBar, Avatar, Box, InputBase, styled, Toolbar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import logo from '../../assets/fruitfull_logo.png';
import { UserMenu } from "../UserMenu";
import { CreatePostButton } from "./CreatePostButton";

interface HeaderProps {
    loggedIn: boolean;
}
export const Header: React.FC<HeaderProps> = ({ loggedIn }) => {
    const StyledAppBar = styled(AppBar)(({ theme }) => ({
        backgroundColor:
            theme.palette.mode === "light" ? "#E5E5E5" : "#121212",
    }));
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.mode === 'light'
            ? theme.palette.grey[900] : 'inherit',
        backgroundColor: theme.palette.mode === 'light'
            ? alpha(theme.palette.grey[800], 0.08)
            : alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.grey[800], 0.15)
                : alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));
    const location = useLocation().pathname;
    const hideHeader = location === '/auth' || (location === '/' && !loggedIn);

    return (

        <StyledAppBar position="static"
            sx={{ display: hideHeader ? 'none' : 'flex', mb: 2 }}>
            <Toolbar variant="dense" >
                <Box pt={1}>
                    <img src={logo} alt="logo" height='50' />
                </Box>

                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'Search' }}
                    />
                </Search>
                <Box sx={{ flexGrow: 1, ml: 1 }} >
                    <CreatePostButton />
                </Box>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <Avatar alt="User Name" src="/path/to/avatar.jpg" sx={{ ml: 1 }} />
                </Link>
                <UserMenu />
            </Toolbar>
        </StyledAppBar >
    );
}