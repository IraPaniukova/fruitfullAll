import { API } from "./axios";

import type { UserOutputDto } from "../utils/interfaces";

export const getUsers = (): Promise<UserOutputDto[]> =>
  API.get("/Users").then((res) => res.data); // GET all users (admin only)

export const getUserMe = (): Promise<UserOutputDto> =>
  API.get(`/Users/me`).then((res) => res.data); // GET current user

export const registerEmailUser = (userData: any): Promise<UserOutputDto> =>
  API.post("/Users", userData).then((res) => res.data); // POST new user (signup with an email)

export const updateUser = (userData: any): Promise<UserOutputDto> =>
  API.put(`/Users/me`, userData).then((res) => res.data); // PUT update user info

export const updateUserLogin = (loginData: any): Promise<UserOutputDto> =>
  API.put(`/Users/me/login`, loginData).then((res) => res.data); // PUT update login data

export const deleteUser = (id: number): Promise<void> =>
  API.delete(`/Users/${id}`).then(() => {}); // DELETE user by id
