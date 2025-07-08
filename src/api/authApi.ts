import { API } from "./axios";

export const login = (data: { email: string; password: string }) =>
  API.post("/Auth/login", data).then((res) => res.data);

export const loginWithGoogle = (idToken: string) =>
  API.post("/Auth/login/google", { idToken }).then((res) => res.data);

export const logout = (refreshToken: string) =>
  API.post("/Auth/logout", { refreshToken }).then((res) => res.data);

export const refreshToken = (refreshToken: string) =>
  API.post("/Auth/refresh-token", { refreshToken }).then((res) => res.data);
