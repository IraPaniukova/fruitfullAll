import { useState } from 'react';
import { Stack, TextField, Button, Typography, Box } from '@mui/material';

export const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password: string) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\s]).{8,}$/.test(password);

    const handleSubmit = () => {
        const emailError = !validateEmail(email) ? 'Enter a valid email' : '';
        const passwordError = !validatePassword(password)
            ? 'At least 1 uppercase, 1 lowercase, 1 symbol, 8 characters'
            : '';

        setErrors({ email: emailError, password: passwordError });

        if (!emailError && !passwordError) {
            // submit logic here
        }
    };

    return (
        <Stack spacing={3} >
            <Typography variant="h6">Register</Typography>

            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
            />

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
            />
            <Box>
                <Button onClick={handleSubmit}>
                    Tri it
                </Button>
            </Box>
        </Stack>
    );
};
