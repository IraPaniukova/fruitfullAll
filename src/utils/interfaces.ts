export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  expiresAt: string; // ISO date string
  userId: number;
}

export interface UserOutputDto {
  userId: number;
  country?: string;
  theme?: string;
  nickname?: string;
  profileImage?: string;
  createdAt?: string; // ISO date string
  email: string;
}

export interface PostInputDto {
  content: string;
  opinion?: string;
  company: string;
  industry: string;
  year: number | null;
  country: string;
  stressLevel: number | null;
  questionType: string;
  interviewFormat: string;
  tags: string[];
}

export interface PostOutputDto {
  postId: number;
  content?: string;
  opinion?: string;
  company?: string;
  industry?: string;
  year?: number;
  country?: string;
  stressLevel?: number;
  questionType?: string;
  interviewFormat?: string;
  userId: number;
  createdAt?: string; // ISO date string
  isDeleted?: boolean;
  likesCount?: number;
  tags: string[];
}

export interface PostSummaryDto {
  postId: number;
  userId: number;
  content?: string;
  industry?: string;
  stressLevel?: number;
  country?: string;
  createdAt?: string;
  tags?: string[];
}

export interface PostLikeDto {
  userId: number;
  postId: number;
  likesCount?: number;
}

export interface CommentInputDto {
  postId: number;
  userId: number;
  text: string;
}

export interface CommentOutputDto {
  commentId?: number;
  postId?: number;
  userId?: number;
  text?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string;
  isDeleted: boolean;
  likesCount?: number;
  nickname?: string;
  profileImage?: string;
}

export interface CommentLikeDto {
  userId: number;
  commentId: number;
  likesCount?: number;
}

export interface CommentUpdateDto {
  text: string;
}
