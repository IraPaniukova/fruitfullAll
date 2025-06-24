import { useEffect, useState } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

type Post = {
    questions: string;
    company: string;
    industry: string;
    year: number | '';
    country: string;
    stressLevel: string;
    questionType: string;
    interviewFormat: string;
    opinion?: string;
    tags?: string[];
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
                questions: 'Describe a time you solved a tough bug.',
                company: 'Example Co',
                industry: 'Video games',
                year: 2024,
                country: 'New Zealand',
                stressLevel: '3',
                questionType: 'Technical',
                interviewFormat: 'Face to face with one',
                opinion: 'Stay calm and explain your thought process clearly.',
                tags: ['bugfix', 'problem solving', 'technical'],
            };
            setPost(fetchedPost);
        }
        fetchPost();
    }, [postId]);

    if (!post) return <div>Loading...</div>;

    return (
        <Stack spacing={2}
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
                {post.company} • Industry: {post.industry} • {post.year} • {post.country} • {post.questionType} • {post.interviewFormat} • Stress: {post.stressLevel}
            </Typography>

            <Typography variant="button" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Questions Asked:
            </Typography>
            <Typography>{post.questions}</Typography>

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
                post.tags && post.tags.length > 0 && (
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography variant="caption" color="text.secondary">
                            Tags:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {post.tags.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    component={Link}
                                    to={`/tags/${tag}`}//TODO: decide where i place the results of this search
                                    clickable
                                    size="small"
                                />
                            ))}
                        </Box>
                    </Stack>
                )
            }

        </Stack >

    );
};
