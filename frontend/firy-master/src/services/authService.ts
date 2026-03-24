import api from "./api";
import type { LoginPayload } from "../types";

export const loginUser = async (data: LoginPayload) => {
  const response = await api.post("/Auth/login", data);
  return response.data;
};
