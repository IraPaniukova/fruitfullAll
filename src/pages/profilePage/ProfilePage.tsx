import { Box, Avatar, Typography, Paper, Stack, Grid, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import { ToggleThemeButton } from '../../features/theme/components/ToggleThemeButton';
import { ConfirmChangesButton } from './ConfirmChangesButton';
import { getUserMe } from '../../api/userApi';
import type { UserOutputDto } from '../../utils/interfaces';

export const ProfilePage = () => {
    const [editIt, setEditIt] = useState(false);
    const [data, setData] = useState<UserOutputDto | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const data = await getUserMe();
            setData(data);
        }
        fetchUser();
    }, []);

    const onEditIconClick = () => {
        setEditIt(true);
    }
    const onConfirmClick = () => {
        setEditIt(false);
    }
    const createdAt = data?.createdAt
        ? new Date(data.createdAt).toLocaleString('en-US', {
            month: 'short',
            year: 'numeric',
        })
        : '';
    const nickname = data?.nickname ?? 'Anonymus';
    const country = data?.country;
    const theme = data?.theme;
    return (
        <Stack minHeight='100vh' justifyContent='center' alignItems='center'>
            <Paper
                elevation={3}
                sx={{
                    my: 2,
                    p: 4,
                    borderRadius: '16px',
                    minWidth: 400,
                }}
            >
                <Stack spacing={3} alignItems="center" minHeight='80vh' sx={{ position: 'relative' }}>
                    <Box position='absolute' top={0} right={0}>
                        {!editIt &&
                            <IconButton onClick={onEditIconClick} aria-label="Edit">
                                <EditIcon />
                            </IconButton>}
                    </Box>
                    <Avatar
                        sx={{ width: 100, height: 100, bgcolor: 'orange', fontSize: 40 }}
                    >
                        {nickname === 'Anonymus' ?
                            'ツ' :
                            nickname[0]?.toUpperCase() || 'ツ'}
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                        {nickname}
                    </Typography>
                    <Typography>Member Since: {createdAt}</Typography>
                    {country && <Typography>Country: {country}</Typography>}
                    <Stack direction='row' spacing={1} height='40px' alignItems='center'>
                        <Typography>Theme:</Typography>
                        {editIt ?
                            <Stack direction='row' spacing={1}>
                                <ToggleThemeButton />
                                <ConfirmChangesButton onConfirmClick={onConfirmClick} />
                            </Stack> :
                            <Typography>{theme}</Typography>
                        }
                    </Stack>

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
            </Paper >
        </Stack >
    );
};
