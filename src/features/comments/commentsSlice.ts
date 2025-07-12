import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CommentOutputDto, CommentLikeDto } from "../../utils/interfaces";

interface CommentsState {
  comments: CommentOutputDto[];
}

const initialState: CommentsState = {
  comments: [],
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<CommentOutputDto>) {
      state.comments.push(action.payload);
    },
    editComment(state, action: PayloadAction<CommentOutputDto>) {
      const index = state.comments.findIndex(
        (c) => c.commentId === action.payload.commentId
      );
      if (index !== -1) state.comments[index] = action.payload;
    },
    deleteComment(state, action: PayloadAction<number>) {
      state.comments = state.comments.filter(
        (c) => c.commentId !== action.payload
      );
    },
    likeComment(state, action: PayloadAction<CommentLikeDto>) {
      const comment = state.comments.find(
        (c) => c.commentId === action.payload.commentId
      );
      if (comment) comment.likesCount = action.payload.likesCount;
    },
  },
});

export const { addComment, editComment, deleteComment, likeComment } =
  commentsSlice.actions;
export default commentsSlice.reducer;
