import type { AuthResponseDto } from "../utils/interfaces";
import { API } from "./axios";

export const login = (data: {
  email: string;
  password: string;
}): Promise<AuthResponseDto> =>
  API.post<AuthResponseDto>("/Auth/login", data).then((res) => res.data);

export const loginWithGoogle = (idToken: string): Promise<AuthResponseDto> =>
  API.post<AuthResponseDto>("/Auth/login/google", { idToken }).then(
    (res) => res.data
  );

export const logout = (refreshToken: string): Promise<void> =>
  API.post("/Auth/logout", { refreshToken }).then((res) => res.data);

export const refreshToken = (refreshToken: string): Promise<AuthResponseDto> =>
  API.post<AuthResponseDto>("/Auth/refresh-token", { refreshToken }).then(
    (res) => res.data
  );
