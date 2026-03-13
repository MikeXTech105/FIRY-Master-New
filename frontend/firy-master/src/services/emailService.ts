import api from "./api";

export const addEmails = async (data: any) => {
  const res = await api.post("/Email/AddEmails", data);
  return res.data;
};

export const getEmails = async () => {
  const res = await api.get("/Email/GetEmails");
  return res.data;
};