import { Stack, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface LikeToggleProps {
    liked: boolean;
    likeCount: number;
    ToggleLike: () => void;
}

export const LikeToggle = ({ liked, likeCount, ToggleLike }: LikeToggleProps) => (
    <Stack position='absolute' bottom={0} right={6}
        direction="row"
    >
        <Typography color="text.secondary" sx={{ fontSize: 15 }}>{likeCount}</Typography>
        <IconButton
            onClick={ToggleLike}
            sx={{
                color: 'orange', padding: '0 0 2px 3px', fontSize: '15px'
            }}
            aria-label={liked ? 'Unlike' : 'Like'}
        >
            {liked ? <FavoriteIcon sx={{ fontSize: '15px' }} /> : <FavoriteBorderIcon sx={{ fontSize: '15px' }} />}
        </IconButton>

    </Stack>
);
