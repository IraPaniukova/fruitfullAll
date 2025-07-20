import { Button, Typography, Stack, IconButton, Tooltip } from '@mui/material';
import logo from '../../assets/fruitfull_logo_name.png'
import { GridBox } from '../../components/GridBox';
import { ChequeredTiles } from '../../components/ChequeredTiles';
import { ContentStack } from '../../components/ContentStack';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToggleThemeButton } from '../../features/theme/components/ToggleThemeButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <GridBox >
            <ChequeredTiles />
            <ContentStack pb={{ xs: '400px', sm: '50px', lg: '200px' }} >
                <img src={logo} alt='logo' height='200px' width='auto' />
            </ContentStack>
            <ContentStack zIndex='1' pl={{ xs: 0, sm: '300px' }}>
                <Button component={NavLink}
                    to='/auth'>try it</Button>
            </ContentStack>
            <ContentStack pt='300px' px={3} spacing={1}>
                <Typography variant='button'>Where your career starts</Typography>
                <Typography variant='button'>Share and discuss real interview questions and tips</Typography>
            </ContentStack>
            <Stack zIndex={1} position='absolute' top={0} left={0} direction='row' >
                <ToggleThemeButton />
                <Tooltip title='About us' placement="right">
                    <IconButton onClick={() => { navigate('/about') }} aria-label='Go to About page'>
                        <HelpOutlineIcon />
                    </IconButton>
                </Tooltip>
            </Stack>

        </GridBox >
    );
}