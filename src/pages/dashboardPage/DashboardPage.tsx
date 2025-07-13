import { useCallback, useEffect, useRef, useState } from "react";
import { PostSummary } from "../../components/PostSummary";
import { getRecentPosts } from "../../api/postApi";
import type { PostSummaryDto } from "../../utils/interfaces";
import { Box, CircularProgress, Typography } from "@mui/material";


export const DashboardPage = () => {
    const [posts, setPosts] = useState<PostSummaryDto[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // useRef for the element to observe
    const observerTarget = useRef<HTMLDivElement | null>(null);

    const fetchPosts = useCallback(async (pageNum: number) => {
        if (loading || !hasMore) return; // Prevents multiple fetches or fetching if no more data
        setLoading(true);
        try {
            const pageSize = 10;
            const data = await getRecentPosts(pageNum, pageSize);
            if (data.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prevPosts) => [...prevPosts, ...data]);
                setPage((prevPage) => prevPage + 1); // Increment page for the next fetch
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore]);

    // Initial fetch when component mounts
    useEffect(() => {
        fetchPosts(1);
    }, []);

    // Intersection Observer setup
    useEffect(() => {
        const currentObserverTarget = observerTarget.current;

        if (!currentObserverTarget) return; // Ensures that the ref is attached

        const observer = new IntersectionObserver(
            (entries) => {
                const targetEntry = entries[0];
                // If the target element is intersecting (visible) and not already loading, and there's more data:
                if (targetEntry.isIntersecting && !loading && hasMore) {
                    fetchPosts(page); // Fetches the next page that was set here: setPage((prevPage) => prevPage + 1);
                }
            },
            {
                root: null, // Use the viewport as the root
                rootMargin: '0px', // No extra margin
                threshold: 0.1, // Trigger when 10% of the target is visible
            }
        );

        observer.observe(currentObserverTarget);

        // Cleanup function for when the component unmounts or dependencies change
        return () => {
            if (currentObserverTarget) {
                observer.unobserve(currentObserverTarget);
            }
        };
    }, [loading, hasMore, page, fetchPosts]);

    return (
        <Box p={2} mx={{ xs: 'auto', lg: '10%' }}>
            <Typography variant="h5" gutterBottom>Check out the latest posts from the community</Typography>

            {posts.length > 0 ? (
                <PostSummary posts={posts} />
            ) : (
                !loading && <Typography>No posts found.</Typography>
            )}

            {/*When 10% of this box becomes visible, it loads one more page - set in  threshold: 0.1, threshold: 0.1*/}
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