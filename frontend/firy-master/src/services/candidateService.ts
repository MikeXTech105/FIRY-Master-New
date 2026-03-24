import axios from "axios";
import api from "./api";
import type { Candidate } from "../types";

export const getCandidates = async () => {
  const response = await api.get("/Candidate/GetCandidate");
  return response.data;
};

export const deleteCandidate = async (id: number) => {
  const response = await api.post("/Candidate/DeleteCandidate", null, {
    params: {
      ID: id,
    },
  });

  return response.data;
};

export const toggleCandidateStatus = async (id: number, isActive: boolean) => {
  const response = await api.post("/Candidate/IsActiveCandidate", null, {
    params: {
      ID: id,
      isActive,
    },
  });

  return response.data;
};

export const createCandidate = async (data: Omit<Candidate, "id" | "isActive" | "resumeFilePath">) => {
  const formData = new FormData();

  formData.append("Name", data.name);
  formData.append("RoleId", String(data.roleId ?? ""));
  formData.append("PhoneNumber", data.phoneNumber);
  formData.append("Email", data.email);
  formData.append("AppPassword", data.appPassword ?? "");
  formData.append("Subject", data.subject);
  formData.append("Body", data.body ?? "");

  if (data.resumeFile) {
    formData.append("ResumeFile", data.resumeFile);
  }

  const response = await api.post("/Candidate/CreateCandidate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const viewResume = async (resumeFilePath: string) => {
  return axios.get(`/api/Candidate/view-resume?resumeFilePath=${resumeFilePath}`, {
    responseType: "blob",
  });
};
