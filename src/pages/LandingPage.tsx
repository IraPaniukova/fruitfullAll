import { Box, Button, Stack, styled, Typography } from '@mui/material';
import logo from '../assets/fruitfull_logo_name.png'
// import { ThemeToggleButton } from '../features/theme/components/ThemeToggleButton';
const ContentStack = styled(Stack)({
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100vw',
    height: '100vh',
});

export const LandingPage = () => {

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                height: '100vh',
                width: '100vw'
            }}
        >
            <Box />
            <Box sx={{ backgroundColor: 'background.paper' }} />
            <Box sx={{ backgroundColor: 'background.paper' }} />
            <Box />
            <ContentStack pb={{ xs: '400px', sm: '200px' }}
                sx={{
                    '@media (max-width:900px) and (orientation: landscape)': {
                        pb: '0px',
                    },
                }}
            >
                <img src={logo} alt='logo' height='200px' width='auto' />
            </ContentStack>
            <ContentStack zIndex='1' pl={{ xs: 0, sm: '300px' }}>
                <Button>try it</Button>
            </ContentStack>
            <ContentStack pt='300px' px={3} spacing={1}>
                <Typography variant='button'>Where career starts</Typography>
                <Typography variant='button'>Share and discuss real interview questions and tips</Typography>
            </ContentStack>
            {/* <Box zIndex={1}> <ThemeToggleButton /></Box> */}
        </Box>
    );
}