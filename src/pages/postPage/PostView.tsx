import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

type Post = {
    company?: string;
    industry?: string;
    country: string;
    year: string;
    stress: number;
    questionType: string;
    questions: string;
    tips?: string;
};

type Props = {
    postId: string;
};

export const PostView = ({ postId }: Props) => {
    const [post, setPost] = useState<Post | null>(null);


    //TODO: clear the mockup later:

    useEffect(() => {
        //TODO: fetch post details by postId (replace with your API)
        async function fetchPost() {
            // mock fetch
            const fetchedPost: Post = {
                company: 'Example Co',
                country: 'NZ',
                year: '2024',
                stress: 3,
                questionType: 'Technical',
                questions: 'Describe a time you solved a tough bug.',
                tips: 'Stay calm and explain your thought process clearly.',
            };
            setPost(fetchedPost);
        }
        fetchPost();
    }, [postId]);

    if (!post) return <div>Loading...</div>;

    return (
        <Box
            mb={4}
            p={2}
            borderRadius={2}
            border="1px solid"
            borderColor="divider"
            sx={{
                textAlign: 'left',
                backgroundColor: 'background.paper',
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                mb={1}
            >
                {post.company ?? post.industry} • {post.year} • {post.country} • Stress: {post.stress} • Type: {post.questionType}
            </Typography>

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Questions Asked:
            </Typography>
            <Typography>{post.questions}</Typography>

            {post.tips && (
                <>
                    <Typography variant="subtitle1" fontWeight={600} mt={2}>
                        Opinion:
                    </Typography>
                    <Typography>{post.tips}</Typography>
                </>
            )}
        </Box>

    );
};
