import { useState } from 'react';
import { Stack, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { registerEmailUser } from "../../../api/userApi";
import { loginThunk } from "../authThunks";
import { useAppDispatch } from "../../../store/typeHooks";

export const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);


    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);

    const validatePassword = (password: string) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\s]).{8,}$/.test(password);

    const dispatch = useAppDispatch();
    const handleSubmit = async () => {
        const emailError = !validateEmail(email) ? 'Enter a valid email' : '';
        const passwordError = !validatePassword(password)
            ? 'At least 1 uppercase, 1 lowercase, 1 symbol, 8 characters'
            : '';

        setErrors({ email: emailError, password: passwordError });

        if (!emailError && !passwordError) {

            try {
                await registerEmailUser({ email, password });
                dispatch(loginThunk(email, password));
            } catch (err) {
                console.error("Failed to register:", err);
                setSnackbarOpen(true);
            }

        }
    };

    return (
        <Stack spacing={3} justifyContent="center" height='100%' pb={2}>
            <Typography variant="h6">Sign Up</Typography>

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
                <Button onClick={handleSubmit} sx={{ width: '80px' }}>
                    Join
                </Button>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
                    Email already exists.
                </Alert>
            </Snackbar>
        </Stack>
    );
};
