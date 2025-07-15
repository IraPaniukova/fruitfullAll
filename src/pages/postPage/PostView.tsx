import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { PostTags } from '../../components/PostTags';
import type { PostOutputDto } from '../../utils/interfaces';
import { getPostById } from '../../api/postApi';
import { UpdatePostButton } from '../../components/UpdatePostButton';
import { useLocation } from 'react-router-dom';
import { DeletePostButton } from '../../components/DeletePostButton';
import { useAppSelector } from '../../store/typeHooks';

type Props = {
    postId: number;
};

export const PostView = ({ postId }: Props) => {
    const [post, setPost] = useState<PostOutputDto | null>(null);
    const location = useLocation().pathname;
    const loggedIn = useAppSelector(state => !!state.auth.accessToken);
    useEffect(() => {
        if (!loggedIn) return;
        const fetchPosts = async () => {
            try {
                const data = await getPostById(postId);
                setPost(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        }
        fetchPosts();
    }, [postId]);

    if (!post) return <div>Loading...</div>;

    const userId = Number(localStorage.getItem('userId'));


    return (
        <Stack spacing={2} mb={4} p={2}
            borderRadius={2}
            border="1px solid"
            borderColor="divider"
            sx={{ textAlign: 'left', backgroundColor: 'background.paper', }}
            position='relative'
        >
            <Stack direction='row' spacing={1}
                position='absolute' top={10} right={10} >
                {post.userId === userId && location !== '/' &&
                    (
                        <>
                            <UpdatePostButton postId={post.postId} />
                            <DeletePostButton postId={post.postId} post={post} />
                        </>
                    )
                }
            </Stack>
            <Typography
                variant="body2"
                color="text.secondary"
                mb={1}
            >
                {post.company} • Industry: {post.industry} • {post.year} • {post.country} • {post.questionType} • {post.interviewFormat} • Stress: {post.stressLevel}
            </Typography>

            <Typography align='justify' variant="button" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Interview Questions Asked:
            </Typography>
            <Typography>{post.content}</Typography>

            {
                post.opinion && (
                    <>
                        <Typography variant="button" color="text.secondary" sx={{ fontSize: '0.8rem' }} >
                            Opinion:
                        </Typography>
                        <Typography>{post.opinion}</Typography>
                    </>
                )
            }
            {
                post.tags && post.tags.length > 0 && <PostTags tags={post.tags} />
            }

        </Stack >

    );
};
