import { API } from "./axios";
import type {
  PostOutputDto,
  PostSummaryDto,
  PostLikeDto,
  PostInputDto,
} from "../utils/interfaces";

// GET recent posts with pagination
export const getRecentPosts = (
  page = 1,
  pageSize = 10
): Promise<PostSummaryDto[]> =>
  API.get(`/Posts/recent?page=${page}&pageSize=${pageSize}`).then(
    (res) => res.data
  );

// POST create a new post
export const createPost = (
  post: Partial<PostInputDto>
): Promise<PostOutputDto> => API.post("/Posts", post).then((res) => res.data);

// PUT update a post by ID
export const updatePost = (
  id: number,
  dto: Partial<PostInputDto>
): Promise<PostOutputDto> =>
  API.put(`/Posts/${id}`, dto).then((res) => res.data);

// GET a post by ID
export const getPostById = (id: number): Promise<PostOutputDto> =>
  API.get(`/Posts/${id}`).then((res) => res.data);

// GET posts by tag name
export const getPostsByTag = (tagName: string): Promise<PostSummaryDto[]> =>
  API.get(`/Posts/by-tag?tagName=${encodeURIComponent(tagName)}`).then(
    (res) => res.data
  );

// GET posts by user ID with pagination
export const getPostsByUserId = (
  userId: number,
  page = 1,
  pageSize = 10
): Promise<PostSummaryDto[]> =>
  API.get(`/Posts/User/${userId}?page=${page}&pageSize=${pageSize}`).then(
    (res) => res.data
  );

// GET posts by current user with pagination
export const getMyPosts = (
  page = 1,
  pageSize = 10
): Promise<PostSummaryDto[]> =>
  API.get(`/Posts/User/me?page=${page}&pageSize=${pageSize}`).then(
    (res) => res.data
  );

// DELETE a post by ID
export const deletePost = (id: number): Promise<void> =>
  API.delete(`/Posts/${id}`).then(() => {});

// PATCH toggle like for a post by ID
export const toggleLikePost = (postId: number): Promise<PostLikeDto> =>
  API.patch(`/Posts/${postId}`).then((res) => res.data);
