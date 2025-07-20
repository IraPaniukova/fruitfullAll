import { useState } from 'react';
import { Stack, TextField, Button, Typography, Box } from '@mui/material';
import { loginThunk } from "../authThunks";
import { useAppDispatch } from "../../../store/typeHooks";


export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginThunk(email, password));
            setError('');
        } catch {
            setError('Invalid email or password');
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
            {error && (
                <Typography color="error" fontSize="0.9rem">
                    {error}
                </Typography>
            )}
            <Box>
                <Button onClick={(e) => handleSubmit(e)} sx={{ width: '80px' }}>
                    Login
                </Button>
            </Box>
        </Stack>
    );
};
