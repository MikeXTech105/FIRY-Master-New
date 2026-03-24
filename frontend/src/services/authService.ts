import api from "./api";

export const loginUser = async (data: any) => {
  const response = await api.post("/Auth/login", data);
  return response.data;
};

export const createUser = async (data: any) => {
  const response = await api.post("/Auth/CreateUser", data);
  return response.data;
};

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};