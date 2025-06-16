import { Box, Typography } from "@mui/material";
import { GridBox } from '../components/GridBox';
import { ChequeredTiles } from '../components/ChequeredTiles';
import { ContentStack } from '../components/ContentStack';
import { RegisterForm } from "./RegisterForm";

export const AuthPage = () => {
    return (
        <GridBox >
            <ChequeredTiles />
            <ContentStack>
                <Box width='500px' height='400px' p={2}
                    sx={{
                        backgroundColor: 'background.default',
                        borderRadius: '15px', border: '2px solid orange'
                    }}
                >
                    <Typography variant='button'>Login / Register</Typography>
                    <RegisterForm />
                </Box>
            </ContentStack>
        </GridBox>
    );
}