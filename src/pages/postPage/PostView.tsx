import { useEffect, useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

type Post = {
    company?: string;
    industry?: string;
    country: string;
    year: string;
    stress: number;
    questionType: string;
    questions: string;
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
                company: 'Example Co',
                country: 'NZ',
                year: '2024',
                stress: 3,
                questionType: 'Technical',
                questions: 'Describe a time you solved a tough bug.',
                opinion: 'Stay calm and explain your thought process clearly.',
                tags: ['bugfix', 'problem solving', 'technical'],
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

            {post.opinion && (
                <>
                    <Typography variant="subtitle1" fontWeight={600} mt={2}>
                        Opinion:
                    </Typography>
                    <Typography>{post.opinion}</Typography>
                </>
            )}
            {post.tags && post.tags.length > 0 && (
                <>
                    <Typography variant="subtitle1" fontWeight={600} mt={2}>
                        Tags:
                    </Typography>
                    <Box mt={1} display="flex" gap={1} flexWrap="wrap">
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
                </>
            )}

        </Box>

    );
};
