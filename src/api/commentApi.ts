import { API } from "./axios";
import type {
  CommentOutputDto,
  CommentInputDto,
  CommentLikeDto,
  CommentUpdateDto,
} from "../utils/interfaces";

// GET comment by id
export const getComment = (id: number): Promise<CommentOutputDto> =>
  API.get(`/Comments/${id}`).then((res) => res.data);

// GET comments by post id
export const getCommentsByPostId = (
  postId: number
): Promise<CommentOutputDto[]> =>
  API.get(`/Comments/Post/${postId}`).then((res) => res.data);

// POST create a comment
export const createComment = (
  commentData: CommentInputDto
): Promise<CommentOutputDto> =>
  API.post("/Comments", commentData).then((res) => res.data);

// PUT update comment by id
export const updateComment = (
  id: number,
  commentData: CommentUpdateDto
): Promise<CommentOutputDto> =>
  API.put(`/Comments/${id}`, commentData).then((res) => res.data);

// DELETE comment by id
export const deleteComment = (id: number): Promise<void> =>
  API.delete(`/Comments/${id}`).then((res) => res.data);

// PATCH toggle like on comment
export const toggleLikeComment = (commentId: number): Promise<CommentLikeDto> =>
  API.patch(`/Comments/${commentId}`).then((res) => res.data);
