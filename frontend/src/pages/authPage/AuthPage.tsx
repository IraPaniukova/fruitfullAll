import { Box, Button, Stack } from "@mui/material";
import { GridBox } from '../../components/GridBox';
import { ChequeredTiles } from '../../components/ChequeredTiles';
import { ContentStack } from '../../components/ContentStack';
import { SignupForm } from "../../features/auth/components/SignupForm";
import { useState } from "react";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { GoogleAuthForm } from "../../features/auth/components/GoogleAuthForm";

export const AuthPage = () => {
    const [loginForm, setLoginForm] = useState(true);
    const [googleLogin, setGoogleLogin] = useState(true);
    const handleSwitchToEmailAuth = () => {
        setGoogleLogin(!googleLogin);
    }
    const handleSwitch = () => {
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
                    {googleLogin ?
                        <>
                            <Box
                                sx={{
                                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                                    backgroundColor: 'background.paper',
                                    borderRadius: '8px', p: '2px', mt: 2, mb: 5
                                }}
                            >
                                <GoogleAuthForm />
                            </Box>
                            <Button variant="text" onClick={handleSwitchToEmailAuth}>Continue with Email</Button>
                        </>
                        :
                        <>
                            <Stack direction='row' justifyContent='space-between'>
                                <Button variant="text" onClick={handleSwitchToEmailAuth}>Back to Google</Button>

                                <Button variant="text" onClick={handleSwitch}>
                                    Go to {loginForm ? 'Sign Up' : 'Login'}
                                </Button>
                            </Stack>
                            {loginForm ? <LoginForm /> : <SignupForm />}
                        </>}
                </Box>
            </ContentStack>
        </GridBox >
    );
}