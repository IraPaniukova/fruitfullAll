import { Box, Avatar, Typography, Paper, Stack, Grid, TextField, Snackbar, Alert, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { ToggleThemeButton } from '../../features/theme/components/ToggleThemeButton';
import { ConfirmChangesButton } from './ConfirmChangesButton';
import { getUserMe, updateUser } from '../../api/userApi';
import type { UserOutputDto } from '../../utils/interfaces';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/typeHooks';

export const ProfilePage = () => {
    // const [editAvatar, setEditAvatar] = useState(false);
    const [editNickname, setEditNickname] = useState(false);
    const [editCountry, setEditCountry] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [newCountry, setNewCountry] = useState('');

    const [errorOpen, setErrorOpen] = useState(false);

    const [data, setData] = useState<UserOutputDto | null>(null);

    const [refresh, setRefresh] = useState(false);

    const loggedIn = useAppSelector(state => !!state.auth.accessToken);
    useEffect(() => {
        if (!loggedIn) return;
        const fetchUser = async () => {
            try {
                const data = await getUserMe();
                setData(data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        }
        fetchUser();
    }, [refresh]);

    // const onEditAvatarClick = () => {  //TODO: Add functionality if there is enough time
    //     setEditAvatar(true);
    // }
    const onEditNicknameClick = () => {
        setEditNickname(true);
    }
    const onEditCountryClick = () => {
        setEditCountry(true);
    }
    const onDeleteIconClick = async () => {
        try {
            await updateUser({ nickname: '' });
            setRefresh(!refresh);
        }
        catch (error) {
            setErrorOpen(true);
        }
        setEditNickname(false);
    }
    const onConfirmClick = async () => {
        try {
            if (newNickname) {
                await updateUser({ nickname: newNickname.trim() });
            }
            if (newCountry) {
                await updateUser({ country: newCountry.trim() });
            }
            setRefresh(!refresh);
        }
        catch (error) {
            setErrorOpen(true);
        }
        // setEditAvatar(false);
        setEditNickname(false);
        setEditCountry(false);
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
        <>
            <Snackbar open={errorOpen} autoHideDuration={4000} onClose={() => setErrorOpen(false)}>
                <Alert severity="error" onClose={() => setErrorOpen(false)}>
                    Failed to save. Please check your connection.
                </Alert>
            </Snackbar>
            <Stack justifyContent='center' alignItems='center'>
                <Paper
                    elevation={3}
                    sx={{
                        my: 2,
                        p: 4,
                        borderRadius: '16px',
                        minWidth: 400,
                    }}
                >
                    <Stack spacing={3} alignItems="center" sx={{ position: 'relative' }}>
                        <Box position='absolute' top={0} right={0}>
                            <ToggleThemeButton />
                        </Box>

                        <Stack direction='row' alignItems='flex-end' pl={3}>
                            <Avatar
                                sx={{ width: 100, height: 100, bgcolor: 'orange', fontSize: 40 }}
                            >
                                {nickname === 'Anonymus' ?
                                    'ツ' :
                                    nickname[0]?.toUpperCase() || 'ツ'}
                            </Avatar>
                            {/* <EditIcon sx={{ fontSize: 15 }} /> */}
                        </Stack>

                        {editNickname ?
                            <Stack direction='row' alignItems='center' spacing={3} pl={5}>
                                <TextField
                                    label="Enter New Nickname"
                                    value={newNickname}
                                    onChange={(e) => setNewNickname(e.target.value)}
                                />
                                <ConfirmChangesButton onConfirmClick={onConfirmClick} />
                                <Tooltip title="Delete Nickname" placement="right">
                                    <DeleteIcon sx={{ fontSize: 15 }}
                                        onClick={onDeleteIconClick} aria-label="Delete Nickname" />
                                </Tooltip>
                            </Stack> :
                            <Stack direction='row' alignItems='center' spacing={3} pl={5}>
                                <Typography variant="h5" fontWeight="bold">
                                    {nickname}
                                </Typography>
                                <EditIcon sx={{ fontSize: 15 }} onClick={onEditNicknameClick} />
                            </Stack>
                        }

                        <Typography>Member Since: {createdAt}</Typography>

                        {editCountry ?
                            <Stack direction='row' alignItems='center' spacing={3} pl={5}>
                                <TextField
                                    label="Enter New Country"
                                    value={newCountry}
                                    onChange={(e) => setNewCountry(e.target.value)}
                                />
                                <ConfirmChangesButton onConfirmClick={onConfirmClick} />
                            </Stack> :
                            <Stack direction='row' spacing={3} alignItems='center' pl={5}>
                                <Typography>Country: {country ? country : 'None'}</Typography>
                                <EditIcon sx={{ fontSize: 15 }} onClick={onEditCountryClick} />
                            </Stack>
                        }

                        <Typography>Theme: {theme}</Typography>

                        <Link to="/posts/me" style={{ textDecoration: 'none' }}>
                            <Typography >My Interview Stories</Typography>
                        </Link>
                    </Stack>
                </Paper >
            </Stack >
        </>
    );
};
