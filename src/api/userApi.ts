import { API } from "./axios";

export const getUsers = () => API.get("/Users").then((res) => res.data); // GET all users (admin only)

export const getUserMe = () => API.get(`/Users/me`).then((res) => res.data); // GET current user

export const registerEmailUser = (userData: any) =>
  API.post("/Users", userData).then((res) => res.data); // POST new user (signup with an email)

export const updateUser = (userData: any) =>
  API.put(`/Users/me`, userData).then((res) => res.data); // PUT update user info

export const updateUserLogin = (loginData: any) =>
  API.put(`/Users/me/login`, loginData).then((res) => res.data); // PUT update login data

export const deleteUser = (id: number) =>
  API.delete(`/Users/${id}`).then((res) => res.data); // DELETE user by id
