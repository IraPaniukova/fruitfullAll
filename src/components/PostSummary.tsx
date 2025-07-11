import { Box, Grid, Stack, Typography } from '@mui/material';
import type { PostSummaryDto } from '../utils/interfaces';
import { PostTags } from './PostTags';
import { OpenPostButton } from './OpenPostButton';
import { UpdatePostButton } from './UpdatePostButton';
import { useLocation } from 'react-router-dom';

interface PostSummaryProps {
    posts: PostSummaryDto[];
}

export const PostSummary: React.FC<PostSummaryProps> = ({ posts }) => {
    const userId = Number(localStorage.getItem('userId'));
    const location = useLocation().pathname;
    return (
        <Grid container spacing={2}>
            {posts.map((post, i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Stack spacing={2} p={2} height='100%' position="relative"
                        borderRadius={2}
                        border="1px solid"
                        borderColor="divider"
                        sx={{ textAlign: 'left', backgroundColor: 'background.paper' }}
                    >
                        <Box  >
                            <Typography variant="caption" color="text.secondary" mb={1}>
                                • {post?.createdAt ? new Date(post.createdAt).toLocaleString('en-US', { month: 'short', year: 'numeric', }) : ''} • {post.country}  • Industry: {post.industry} • Stress: {post.stressLevel} •
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} >
                            <Typography align="justify"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {post.content}
                            </Typography>
                        </Box>

                        {post.tags && post.tags.length > 0 && <PostTags tags={post.tags} />}

                        <Stack direction='row' alignItems='center'
                            position='absolute' bottom={0} right={0} p={1}>
                            {post.userId === userId && location !== '/' &&
                                (
                                    <UpdatePostButton postId={post.postId} />
                                )}

                            <OpenPostButton postId={post.postId} />
                        </Stack>
                    </Stack>
                </Grid>

            ))}
        </Grid>
    );
};
