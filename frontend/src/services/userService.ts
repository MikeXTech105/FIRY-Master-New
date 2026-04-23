import api from "./api";
import type { ApiResponse } from "./types";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface UserFormData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  isActive?: boolean;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/Users/GetUsers");
  return response.data;
};

export const createUser = async (data: UserFormData): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>("/Users/CreateUser", {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    role: data.role,
  });

  return response.data;
};

export const updateUser = async (data: UserFormData): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>("/Users/UpdateUser", {
    id: data.id ?? 0,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    role: data.role || "",
  });

  return response.data;
};

export const toggleUserStatus = async (id: number, isActive: boolean): Promise<ApiResponse> => {
  const response = await api.get<ApiResponse>("/Users/UserIsActive", {
    params: {
      id,
      isActive,
    },
  });

  return response.data;
};