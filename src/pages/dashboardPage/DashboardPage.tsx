import { useState } from "react";
import { PostSummary } from "../../components/PostSummary";
import { getRecentPosts } from "../../api/postApi";
import type { PostSummaryDto } from "../../utils/interfaces";
import { Box, CircularProgress, Typography } from "@mui/material";
import { usePostScroll } from "../../utils/usePostScroll";
import { FilterByIndustry } from "../../components/FilterByIndustry";


export const DashboardPage = () => {
    const [posts, setPosts] = useState<PostSummaryDto[]>([]);
    const [industry, setIndustry] = useState('');

    const { observerTarget, loading, hasMore } = usePostScroll(getRecentPosts, { setPosts });

    const filteredPosts = industry
        ? posts.filter(p => p.industry === industry)
        : posts;


    return (
        <Box p={2} mx={{ xs: 'auto', lg: '10%' }}>
            <Typography variant="h5" gutterBottom>Check out the latest posts from the community</Typography>

            {posts.length > 0 ? (
                <>
                    <FilterByIndustry industry={industry} onSelect={setIndustry} />
                    <PostSummary posts={filteredPosts} />
                </>
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