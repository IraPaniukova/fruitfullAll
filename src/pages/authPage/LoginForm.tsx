import { Button, TextField, Stack, Typography } from '@mui/material';

export const LoginForm = () => {
    return (
        <Stack spacing={2} width={300}>
            <Typography variant="h6">Login</Typography>
            <TextField label="Email" type="email" fullWidth />
            <TextField label="Password" type="password" fullWidth />
            <Button variant="contained" color="primary">Login</Button>
        </Stack>
    );
};
