export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  expiresAt: string; // usually ISO string
}

export interface UserOutputDto {
  userId: number;
  country?: string;
  theme?: string;
  nickname?: string;
  profileImage?: string;
  createdAt?: string; // Date is usually sent as ISO string
}
