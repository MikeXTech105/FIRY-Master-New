import api from "./api";

// GET
export const getEmailSettings = async () => {
  const res = await api.get("/EmailSettings/GetEmailSettings");
  return res.data;
};

// CREATE
export const createEmailSetting = async (data: any) => {
  return await api.post(
    `/EmailSettings/CreateEmailSetting?key=${encodeURIComponent(data.key)}&value=${encodeURIComponent(data.value)}`
  );
};

// DELETE
export const deleteEmailSetting = async (id: number) => {
  return await api.post(
    `/EmailSettings/DeleteEmailSetting?id=${id}`
  );
};