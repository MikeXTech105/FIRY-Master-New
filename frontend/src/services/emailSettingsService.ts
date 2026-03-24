import api from "./api";

export const getEmailSettings = async () => {
  const res = await api.get("/EmailSettings/GetEmailSettings");
  return res.data;
};

export const createEmailSetting = async (data: any) => {
  return await api.post(
    `/EmailSettings/CreateEmailSetting?key=${encodeURIComponent(data.key)}&value=${encodeURIComponent(data.value)}`
  );
};

export const deleteEmailSetting = async (id: number) => {
  return await api.post(`/EmailSettings/DeleteEmailSetting?id=${id}`);
};

// NEW
export const updateEmailSetting = async (data: { id: string; key: string; value: string }) => {
  return await api.post("/EmailSettings/UpdateEmailSettings", data);
};