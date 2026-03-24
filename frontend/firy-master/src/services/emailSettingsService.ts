import api from "./api";
import type { EmailSetting } from "../types";

export const getEmailSettings = async () => {
  const res = await api.get("/EmailSettings/GetEmailSettings");
  return res.data;
};

export const createEmailSetting = async (data: Pick<EmailSetting, "key" | "value">) => {
  return await api.post(
    `/EmailSettings/CreateEmailSetting?key=${encodeURIComponent(data.key)}&value=${encodeURIComponent(data.value)}`
  );
};

export const deleteEmailSetting = async (id: number) => {
  return await api.post(`/EmailSettings/DeleteEmailSetting?id=${id}`);
};
