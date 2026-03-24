import api from "./api";

export const getRoles = async () => {
  const response = await api.get("/Role/GetRoles");
  return response.data;
};

export const createRole = async (roleName: string) => {
  const response = await api.post(`/Role/CreateRole?roleName=${encodeURIComponent(roleName)}`);
  return response.data;
};

export const deleteRole = async (id: number) => {
  const response = await api.post(`/Role/DeleteRole`, null, {
    params: { id },
  });
  return response.data;
};

export const toggleRoleStatus = async (id: number, isActive: boolean) => {
  const response = await api.post(`/Role/ActiveRole`, null, {
    params: {
      id,
      isActive,
    },
  });

  return response.data;
};
