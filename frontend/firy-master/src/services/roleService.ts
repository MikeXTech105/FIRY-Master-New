import api from "./api";

export const getRoles = async () => {
  const response = await api.get("/Role/GetRoles");
  return response.data;
};
export const createRole = async (roleName:string) => {
  const response = await api.post(`/Role/CreateRole?RoleName=${roleName}`);
  return response.data;
};
export const deleteRole = async (id: number) => {
  const response = await api.post(`/Role/DeleteRole`, null, {
    params: { ID: id }
  });
  return response.data;
};
export const toggleRoleStatus = async (id: number) => {
  const response = await api.post(`/Role/ActivateRole`, null, {
    params: { ID: id }
  });

  return response.data;
};