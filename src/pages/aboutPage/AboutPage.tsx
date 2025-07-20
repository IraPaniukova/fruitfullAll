import { Box, Button, Stack, Typography } from '@mui/material';
import logo from '../../assets/fruitfull_logo_name.png'
import { useAppSelector } from '../../store/typeHooks';
import { useNavigate } from 'react-router-dom';

export const AboutPage = () => {
    const loggedIn = useAppSelector(state => !!state.auth.accessToken);
    const navigate = useNavigate();

    return (
        <Stack
            alignItems="center"
            spacing={3}
            pt={10}
            width={{ xs: '90%', md: '80%' }}
            mx="auto"
            textAlign="center"
        >
            <Typography variant="h4" fontWeight="bold">
                Welcome to Fruitfull!
            </Typography>
            <Box> <img src={logo} alt='logo' height='150px' width='auto' /></Box>
            <Typography color="text.secondary" fontSize={18}>
                Fruitfull is your go-to space to explore, discuss, and master interview questions. Whether you’re prepping for a big tech interview or simply curious about common challenges, Fruitfull connects you with a friendly community eager to share insights and tips. Dive into real questions, share your thoughts, and grow your confidence — all in one easy-to-use app.
            </Typography>
            <Typography variant="body2" color="orange" fontStyle="italic">
                Join the conversation and boost your interview skills today!
            </Typography>

            {!loggedIn &&
                <Box zIndex={1} position='absolute' top={0} left={0} pl={2} >
                    <Button onClick={() => { navigate('/') }} variant='text' sx={{ color: 'text.secondary' }}>
                        Back
                    </Button>
                </Box>}
        </Stack>
    );
};
