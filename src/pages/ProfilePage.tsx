import { Box, Avatar, Typography, Button, Paper, Stack, Grid } from '@mui/material';
//import EditNoteIcon from '@mui/icons-material/EditNote';
import EditIcon from '@mui/icons-material/Edit';
type Props = {
    username?: string;
};

export const ProfilePage = ({ username = 'Anonymous' }: Props) => {
    return (
        <Stack minHeight='100vh' justifyContent='center' alignItems='center'>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: '16px',
                    minWidth: 400,
                }}
            >
                <Stack spacing={3} alignItems="center" minHeight='80vh' sx={{ position: 'relative' }}>
                    <Box position='absolute' top={0} right={0}>  <EditIcon /></Box>
                    <Avatar
                        sx={{ width: 100, height: 100, bgcolor: 'orange', fontSize: 40 }}
                    >
                        {username === 'Anonymous' ?
                            'ツ' :
                            username[0]?.toUpperCase() || 'ツ'}
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                        {username}
                    </Typography>
                    <Typography>Member Since: Jan 2025</Typography>

                    <Typography variant="h6">My Interview Stories</Typography>
                    {/* Link or list preview */}

                    <Typography variant="h6">My Q&A Threads</Typography>
                    {/* Link or list preview */}
                    <Grid container spacing={1} justifyContent="center">
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Typography align="center">Total Contributions</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography align="center">15</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Typography align="center">Average Stress Rating: </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography align="center">3.2</Typography>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Stack>
    );
};
