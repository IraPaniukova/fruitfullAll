import { useCallback, useEffect, useRef, useState } from "react";
import type { PostSummaryDto } from "./interfaces";

type fetchApiDataType = (
  page: number,
  pageSize: number
) => Promise<PostSummaryDto[]>; // can update to <T> that accepts any data type, making the hook reusable for different data structures

interface UseScrollProps {
  setPosts: React.Dispatch<React.SetStateAction<PostSummaryDto[]>>;
}

export const usePostScroll = (
  fetchApiData: fetchApiDataType,
  { setPosts }: UseScrollProps
) => {
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // useRef for the element to observe
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(
    async (pageNum: number) => {
      if (loading || !hasMore) return; // Prevents multiple fetches or fetching if no more data
      setLoading(true);
      try {
        const pageSize = 10;
        const data = await fetchApiData(pageNum, pageSize);
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
    },
    [loading, hasMore]
  );

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
        rootMargin: "0px", // No extra margin
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

  return { observerTarget, loading, hasMore };
};
