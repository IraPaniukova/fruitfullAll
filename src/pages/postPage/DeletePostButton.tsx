import { Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import type { PostOutputDto } from '../../utils/interfaces';
import { deletePost } from '../../api/postApi';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';


interface DeletePostButtonProps {
    postId: number;
    post: PostOutputDto;
}

export const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId, post }) => {
    const userId = Number(localStorage.getItem('userId'));
    const location = useLocation().pathname;
    const navigate = useNavigate();

    const onDeletePost = async () => {
        try {
            await deletePost(postId);
            navigate('/');
        } catch (err) {
            console.error("Failed to create post:", err);
        }
    }

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>{post.userId === userId && location !== '/' &&
            <>
                <Tooltip title='Delete post'>
                    <DeleteIcon sx={{ fontSize: '16px', color: 'orange' }} onClick={handleClickOpen} />
                </Tooltip><Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
                        The post will be deleted
                    </DialogTitle>

                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <Button variant='text' sx={{ color: 'orange', fontSize: '1.2rem' }}
                            onClick={onDeletePost}>
                            Ok
                        </Button>
                        <IconButton sx={{ color: 'orange', fontSize: '1.5rem' }}
                            onClick={handleClose} aria-label='Close dialog'>
                            <CloseIcon />
                        </IconButton>
                    </DialogActions>
                </Dialog>
            </>
        }
        </>
    );
}


