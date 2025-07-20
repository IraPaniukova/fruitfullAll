import { Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';


interface DeleteDialogProps {
    onDelete: () => void;
    type: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({ onDelete, type }) => {

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title={`Delete ${type}`}>
                <DeleteIcon sx={{ fontSize: '16px', color: 'orange' }} onClick={handleClickOpen} />
            </Tooltip><Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
                    The {type} will be deleted
                </DialogTitle>

                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button variant='text' sx={{ color: 'orange', fontSize: '1.2rem' }}
                        onClick={onDelete}>
                        Ok
                    </Button>
                    <IconButton sx={{ color: 'orange', fontSize: '1.5rem' }}
                        onClick={handleClose} aria-label='Close dialog'>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>

    );
}


