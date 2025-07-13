import { Stack, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface LikeToggleProps {
    liked: boolean;
    likeCount: number;
    onToggle: () => void;
}

export const LikeToggle = ({ liked, likeCount, onToggle }: LikeToggleProps) => (
    <Stack
        direction="row"
        spacing={1}
    >
        <IconButton
            onClick={onToggle}
            sx={{ color: 'orange', padding: '2px', fontSize: '15px' }}
            aria-label={liked ? 'Unlike' : 'Like'}
        >
            {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
        <Typography sx={{ fontSize: 15 }}>{likeCount}</Typography>
    </Stack>
);
