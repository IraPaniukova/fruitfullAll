import { useState } from 'react';
import { Stack, TextField, Button, Typography, Box } from '@mui/material';
import { loginThunk } from "../authThunks";
import { useAppDispatch } from "../../../store/typeHooks";


export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginThunk(email, password));
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
                <Button onClick={(e) => handleSubmit(e)}>
                    Login
                </Button>
            </Box>
        </Stack>
    );
};
