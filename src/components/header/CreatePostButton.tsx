import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';

export const CreatePostButton = () => {
    return (
        <Tooltip title="Create post" placement="right">
            <Link to="/create" aria-label="Create post" style={{ textDecoration: 'none' }}>
                <BorderColorIcon />
            </Link>
        </Tooltip>

    );
}
