import { useState } from "react";
import { PostSummary } from "../../components/PostSummary";
import { getRecentPosts } from "../../api/postApi";
import type { PostSummaryDto } from "../../utils/interfaces";
import { Box, CircularProgress, Typography } from "@mui/material";
import { usePostScroll } from "../../utils/usePostScroll";


export const DashboardPage = () => {
    const [posts, setPosts] = useState<PostSummaryDto[]>([]);
    const { observerTarget, loading, hasMore } = usePostScroll(getRecentPosts, { setPosts });

    return (
        <Box p={2} mx={{ xs: 'auto', lg: '10%' }}>
            <Typography variant="h5" gutterBottom>Check out the latest posts from the community</Typography>

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
};