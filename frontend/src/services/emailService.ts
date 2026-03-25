import api from "./api";

export const addEmails = async (data: { emails: string; roleId: number }) => {
  const res = await api.post("/Email/AddEmails", data);
  return res.data;
};

export const getEmails = async (params: {
  searchText?: string;
  roleId?: number;
  pageNumber: number;
  pageSize: number;
}) => {
  const res = await api.post("/Email/GetEmail", params);
  return res.data;
};
