import { AppBar, Avatar, Box, styled, Toolbar, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/fruitfull_logo.png';
import { UserMenu } from "./UserMenu";
import { CreatePostButton } from "./CreatePostButton";

interface HeaderProps {
    loggedIn: boolean;
}
export const Header: React.FC<HeaderProps> = ({ loggedIn }) => {
    const StyledAppBar = styled(AppBar)(({ theme }) => ({
        backgroundColor:
            theme.palette.mode === "light" ? "#E5E5E5" : "#121212",
    }));

    const location = useLocation().pathname;
    const hideHeader = location === '/auth' || (location === '/' && !loggedIn);

    return (
        <StyledAppBar
            position="sticky"
            sx={{
                display: hideHeader ? 'none' : 'flex', mb: 2,
                top: 0,
                zIndex: (theme) => theme.zIndex.appBar,
                backgroundColor: 'background.paper',
            }}>

            <Toolbar variant="dense" >
                <Box pt={1}>
                    <Link to="/"
                        style={{ cursor: location === '/' ? 'default' : 'pointer' }}
                    >
                        <img src={logo} alt="logo" height='50' />
                    </Link>
                </Box>
                <Box sx={{ flexGrow: 1, ml: 1 }} >
                    <CreatePostButton />
                </Box>
                <Tooltip title='Profile Data'>
                    <Link to="/profile" style={{ textDecoration: 'none' }}>
                        {/* <Avatar alt="User Name" src="/path/to/avatar.jpg" sx={{ ml: 1 }} /> */}
                        <Avatar sx={{ bgcolor: 'orange', fontSize: 20, fontWeight: 900 }}>ツ</Avatar>
                    </Link>
                </Tooltip>
                <UserMenu />
            </Toolbar>
        </StyledAppBar >
    );
}