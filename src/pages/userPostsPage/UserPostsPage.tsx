import { useState } from "react";
import { PostSummary } from "../../components/PostSummary";
import { getPostsByUserId } from "../../api/postApi";
import type { PostSummaryDto } from "../../utils/interfaces";
import { Box, Typography, Stack, type TypographyProps, CircularProgress } from "@mui/material";
import { usePostScroll } from "../../utils/usePostScroll";

const InfoText = (props: TypographyProps) => (
    <Typography variant='caption' align='center' color='orange' {...props} />
);

export const UserPostsPage = () => {
    const [posts, setPosts] = useState<PostSummaryDto[]>([]);
    const userId = Number(localStorage.getItem('userId'));

    const fetchPostsByUser = (page: number, pageSize: number) =>
        getPostsByUserId(userId, page, pageSize);
    const { observerTarget, loading, hasMore } = usePostScroll(fetchPostsByUser, { setPosts });

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

            {posts.length > 0 ? (
                <PostSummary posts={posts} />
            ) : (
                !loading && <Typography>No posts found.</Typography>
            )}

            {/*When 10% of this box becomes visible, it loads one more page - set in  threshold: 0.1 in usePostScroll.ts*/}
            {hasMore && (
                <Box ref={observerTarget} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    {loading && <CircularProgress />}
                </Box>
            )}

            {!hasMore && !loading && posts.length > 0 && (
                <Typography variant="body2" color="text.secondary" align="center" mt={4}>
                    You've reached the end of the posts.
                </Typography>
            )}
        </Box>

    );
}