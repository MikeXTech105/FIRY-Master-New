import api from "./api";
import type { CreateEmailSettingRequest } from "./types";

export const getEmailSettings = async () => {
  const res = await api.get("/EmailSettings/GetEmailSettings");
  return res.data;
};

export const createEmailSetting = async (data: CreateEmailSettingRequest) => {
  return await api.post("/EmailSettings/CreateEmailSetting", data);
};

export const deleteEmailSetting = async (id: number) => {
  return await api.post(`/EmailSettings/DeleteEmailSetting?id=${id}`);
};

export const updateEmailSetting = async (data: { id: string; key: string; value: string }) => {
  return await api.post("/EmailSettings/UpdateEmailSettings", data);
};
