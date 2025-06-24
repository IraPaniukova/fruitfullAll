import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PostView } from './PostView';
import { PostDiscussion } from './PostDiscussion';

export const PostPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div>Post not found</div>;

    return (
        <Box p={2} width={{ xs: 'auto', sm: '90%', md: '80%' }} mx='auto'>
            <PostView postId={id} />
            <PostDiscussion postId={id} />
        </Box >
    );
};
