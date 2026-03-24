import axios from "axios";
import api from "./api";
import type { ApiResponse, Candidate, CandidateFormData } from "./types";

export const getCandidates = async (): Promise<Candidate[]> => {
  const response = await api.get<Candidate[]>("/Candidate/GetCandidate");
  return response.data;
};

export const deleteCandidate = async (id: number): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>("/Candidate/DeleteCandidate", null, {
    params: { id },
  });

  return response.data;
};

export const toggleCandidateStatus = async (id: number, isActive: boolean): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>("/Candidate/IsActiveCandidate", null, {
    params: {
      id,
      isActive,
    },
  });

  return response.data;
};

export const createCandidate = async (data: CandidateFormData): Promise<ApiResponse> => {
  const formData = new FormData();

  formData.append("Name", data.name);
  formData.append("RoleId", String(data.roleId));
  formData.append("PhoneNumber", data.phoneNumber);
  formData.append("Email", data.email);
  formData.append("AppPassword", data.appPassword);
  formData.append("Subject", data.subject);
  formData.append("Body", data.body);

  if (data.resumeFile) {
    formData.append("ResumeFile", data.resumeFile);
  }

  const response = await api.post<ApiResponse>("/Candidate/CreateCandidate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const viewResume = async (resumeFilePath: string) =>
  axios.get(`/api/Candidate/view-resume?resumeFilePath=${resumeFilePath}`, {
    responseType: "blob",
  });

export const updateCandidate = async (data: CandidateFormData): Promise<ApiResponse> => {
  const formData = new FormData();

  formData.append("Id", String(data.id ?? 0));
  formData.append("Name", data.name || "");
  formData.append("RoleId", String(data.roleId));
  formData.append("PhoneNumber", data.phoneNumber || "");
  formData.append("Email", data.email || "");
  formData.append("AppPassword", data.appPassword || "");
  formData.append("Subject", data.subject || "");
  formData.append("Body", data.body || "");
  formData.append("IsActive", String(data.isActive ?? true));

  if (data.resumeFile) {
    formData.append("ResumeFile", data.resumeFile);
  }

  formData.append("ResumeFilePath", data.resumeFilePath || "");

  const response = await api.post<ApiResponse>("/Candidate/UpdateCandidate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
