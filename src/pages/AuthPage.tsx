import { Box, Button, Typography, type ButtonProps } from "@mui/material";
import { GridBox } from './shared/GridBox';
import { ChequeredTiles } from './shared/ChequeredTiles';
import { ContentStack } from './shared/ContentStack';
import { SignupForm } from "../features/auth/components/SignupForm";
import { useState } from "react";
import { LoginForm } from "../features/auth/components/LoginForm";

export const AuthPage = () => {
    const [loginForm, setLoginForm] = useState(true);
    const handleSwitchForm = () => {
        setLoginForm(!loginForm);
    }
    return (
        <GridBox >
            <ChequeredTiles />
            <ContentStack>
                <Box minWidth={{ xs: '90vw', sm: '500px' }} p={2}
                    sx={{
                        backgroundColor: 'background.default',
                        borderRadius: '15px', border: '2px solid orange',
                        position: 'relative'
                    }}
                >
                    <Button variant="text" onClick={handleSwitchForm}
                        sx={{
                            position: { xs: 'relative', sm: 'absolute' },
                            top: { xs: 'auto', sm: 0 },
                            right: { xs: 'auto', sm: 0 },
                            color: 'orange',
                            minWidth: 0, background: 'none', boxShadow: 'none', minHeight: 0, aspectRatio: 'auto',
                            fontSize: '0.8rem'
                        }} >
                        Go to {loginForm ? 'Sign Up' : 'Login'}
                    </Button>
                    {loginForm ? <LoginForm /> : <SignupForm />}
                </Box>
            </ContentStack>
        </GridBox >
    );
}