import api from "./api";

export const loginUser = async (data: any) => {
  const response = await api.post("/Auth/login", data);
  return response.data;
};