import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { PostTags } from '../../components/PostTags';
import type { PostOutputDto } from '../../utils/interfaces';
import { getPostById } from '../../api/postApi';

type Props = {
    postId: number;
};

export const PostView = ({ postId }: Props) => {
    const [post, setPost] = useState<PostOutputDto | null>(null);
    useEffect(() => {
        async function fetchPosts() {
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

    return (
        <Stack spacing={2} mb={4} p={2}
            borderRadius={2}
            border="1px solid"
            borderColor="divider"
            sx={{ textAlign: 'left', backgroundColor: 'background.paper', }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                mb={1}
            >
                {post.company} • Industry: {post.industry} • {post.year} • {post.country} • {post.questionType} • {post.interviewFormat} • Stress: {post.stressLevel}
            </Typography>

            <Typography variant="button" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Questions Asked:
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
