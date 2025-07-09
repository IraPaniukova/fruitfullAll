import { useEffect, useState } from "react";
import { PostSummary } from "../../components/PostSummary";
import { getRecentPosts } from "../../api/postApi";
import type { PostSummaryDto } from "../../utils/interfaces";
import { Box } from "@mui/material";

export const DashboardPage = () => {
    const [posts, setPosts] = useState<PostSummaryDto[]>([]);
    useEffect(() => {
        async function fetchPosts() {
            try {
                const data = await getRecentPosts();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        }
        fetchPosts();
    }, []);


    return (
        <Box p={2} mx={{ xs: 'auto', lg: '10%' }}>
            <PostSummary posts={posts} />
        </Box>
    );
}