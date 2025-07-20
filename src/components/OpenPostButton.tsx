import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import ReadMoreIcon from '@mui/icons-material/ReadMore';


interface OpenPostButtonProps {
    postId: number;
}

export const OpenPostButton: React.FC<OpenPostButtonProps> = ({ postId }) => (
    <Tooltip title='Open full post'>
        <Link aria-label="Open full post" to={`/posts/${postId}`}>
            <ReadMoreIcon />
        </Link>
    </Tooltip>
);
