import { useEffect, useState } from "react";
import { PostSummary } from "../../components/PostSummary";
import { getPostsByUserId } from "../../api/postApi";
import type { PostSummaryDto } from "../../utils/interfaces";
import { Box, Typography, Stack, type TypographyProps } from "@mui/material";

const InfoText = (props: TypographyProps) => (
    <Typography variant='caption' align='center' color='orange' {...props} />
);

export const UserPostsPage = () => {
    const [posts, setPosts] = useState<PostSummaryDto[]>([]);
    const userId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        async function fetchPosts() {
            try {
                const data = await getPostsByUserId(userId);
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        }
        fetchPosts();
    }, []);
    const avg = posts.reduce((sum, p) => sum + (p.stressLevel ?? 0), 0) / posts.length;


    return (
        <Box p={2} mx={{ xs: 'auto', lg: '10%' }}>
            <Typography>Everything you've posted so far</Typography>
            <Box ml={2}>
                <Stack direction='row' spacing={2}>
                    <InfoText >Total Contributions</InfoText>
                    <InfoText >{posts.length}</InfoText>
                </Stack>
                <Stack direction='row' spacing={2}>
                    <InfoText >Average Stress Rating: </InfoText>
                    <InfoText >{avg}</InfoText>
                </Stack>
            </Box>
            <PostSummary posts={posts} />
        </Box>
    );
}