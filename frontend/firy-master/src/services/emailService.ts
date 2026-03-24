import api from "./api";
import type { AddEmailsPayload, EmailQueryParams } from "../types";

export const addEmails = async (data: AddEmailsPayload) => {
  const res = await api.post("/Email/AddEmails", data);
  return res.data;
};

export const getEmails = async (params: EmailQueryParams) => {
  const res = await api.post("/Email/GetEmail", params);
  return res.data;
};
