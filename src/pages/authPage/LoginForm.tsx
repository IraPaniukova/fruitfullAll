import { useState } from 'react';
import { Stack, TextField, Button, Typography, Box } from '@mui/material';
import { userEmail, userPasssword } from '../../features/TEMP-DATA/TEMP_DATA';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (email: string) => {
        if (userEmail === email && userPasssword === password) {
            // submit logic here
        }
    };

    return (
        <Stack spacing={3} justifyContent="center" height='100%' pb={2}>
            <Typography variant="h6">Login</Typography>

            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
            />

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
            />
            <Box>
                <Button onClick={() => handleSubmit(email)}>
                    Login
                </Button>
            </Box>
        </Stack>
    );
};
