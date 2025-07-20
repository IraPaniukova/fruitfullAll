import { Button, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <main>
            <Stack
                sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 10,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h1"  >
                    404
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Page Not Found
                </Typography>
                <Button variant="contained" component={NavLink} to="/" sx={{ mt: 5 }}>
                    Go Home
                </Button>
            </Stack>
        </main>
    );
}