import api from "./api";
import type { LoginRequest, LoginResponse } from "./types";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/Auth/login", data);
  return response.data;
};

export const createUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/Auth/CreateUser", data);
  return response.data;
};

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = (): string | null => localStorage.getItem("token");

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => Boolean(getToken());
