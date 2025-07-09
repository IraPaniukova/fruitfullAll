import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PostView } from './PostView';
import { PostComments } from './PostComments';

export const PostPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div>Post not found</div>;

    const postIdNum = Number(id);

    if (isNaN(postIdNum)) return <div>Invalid post ID</div>;

    return (
        <Box p={2} width={{ xs: 'auto', sm: '90%', md: '80%' }} mx="auto">
            <PostView postId={postIdNum} />
            <PostComments postId={postIdNum} />
        </Box>
    );
};
