import { Button, Typography } from '@mui/material';
import logo from '../assets/fruitfull_logo_name.png'
import { GridBox } from './shared/GridBox';
import { ChequeredTiles } from './shared/ChequeredTiles';
import { ContentStack } from './shared/ContentStack';
import { NavLink } from 'react-router-dom';

export const LandingPage = () => {
    return (
        <GridBox >
            <ChequeredTiles />
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
                <Button component={NavLink}
                    to='/auth'>try it</Button>
            </ContentStack>
            <ContentStack pt='300px' px={3} spacing={1}>
                <Typography variant='button'>Where career starts</Typography>
                <Typography variant='button'>Share and discuss real interview questions and tips</Typography>
            </ContentStack>
        </GridBox>
    );
}