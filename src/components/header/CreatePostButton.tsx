import PostAddIcon from '@mui/icons-material/PostAdd';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';

export const CreatePostButton = () => {
    return (
        <Tooltip title="Create post" placement="right">
            <Link to="posts/create" aria-label="Create post" style={{ textDecoration: 'none' }}>
                <PostAddIcon fontSize='large' />
            </Link>
        </Tooltip>

    );
}
