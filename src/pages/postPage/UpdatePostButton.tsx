import { Box, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

interface UpdatePostButtonProps {
    postId: number;
}

export const UpdatePostButton: React.FC<UpdatePostButtonProps> = ({ postId }) => (
    <Tooltip title='Update post'>
        <Box pt={1}>
            <Link aria-label="Update post" to={`/posts/update/${postId}`}>
                <EditIcon sx={{ fontSize: '15px' }} />
            </Link>
        </Box>
    </Tooltip>
);
