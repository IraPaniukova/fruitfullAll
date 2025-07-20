import { useEffect, useState } from "react";
import { PostSummary } from "../../components/PostSummary";
import type { PostSummaryDto } from "../../utils/interfaces";
import { Box, Typography } from "@mui/material";
import { getPostsByTag } from "../../api/postApi";
import { useAppSelector } from "../../store/typeHooks";

export const TagPostsPage = () => {
    const [posts, setPosts] = useState<PostSummaryDto[]>([]);
    const queryParams = new URLSearchParams(location.search);
    const tagName = queryParams.get('tagName');
    if (!tagName) return <Typography>Tag not found.</Typography>;
    const loggedIn = useAppSelector(state => !!state.auth.accessToken);
    useEffect(() => {
        if (!loggedIn) return;
        const fetchPosts = async () => {
            try {
                const data = await getPostsByTag(tagName!);
                console.log("Fetched posts:", data);
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        }
        fetchPosts();
    }, [tagName]);


    return (
        <Box p={2} mx={{ xs: 'auto', lg: '10%' }}>
            <Typography>Posts with tag: {tagName}</Typography>
            <PostSummary posts={posts} />
        </Box>
    );
}