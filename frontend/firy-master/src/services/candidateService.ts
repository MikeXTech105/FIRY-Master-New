import api from "./api";

export const getCandidates = async () => {
  const response = await api.get("/Candidate/GetCandidate");
  return response.data;
};


export const deleteCandidate = async (id: number) => {

  const response = await api.post(
    "/Candidate/DeleteCandidate",
    null,
    {
      params: {
        ID: id
      }
    }
  );

  return response.data;
};

export const toggleCandidateStatus = async (id: number, isActive: boolean) => {
  const response = await api.post("/Candidate/IsActiveCandidate", null, {
    params: {
      ID: id,
      isActive: isActive
    }
  });

  return response.data;
};
export const createCandidate = async (data: any) => {

  const formData = new FormData();

  formData.append("Name", data.name);
  formData.append("RoleId", data.roleId);
  formData.append("PhoneNumber", data.phoneNumber);
  formData.append("Email", data.email);

  // IMPORTANT
  formData.append("AppPassword", data.appPassword);

  formData.append("Subject", data.subject);
  formData.append("Body", data.body);

  if (data.resumeFile) {
    formData.append("ResumeFile", data.resumeFile);
  }

  const response = await api.post(
    "/Candidate/CreateCandidate",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
};