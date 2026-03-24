export interface ApiResponse {
  statusCode: number;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends ApiResponse {
  token?: string;
}

export interface Candidate {
  id: number;
  name: string;
  roleId: number;
  phoneNumber: string;
  email: string;
  appPassword: string;
  subject: string;
  body: string;
  resumeFilePath?: string;
  isActive?: boolean;
}

export interface CandidateFormData {
  id?: number;
  name: string;
  roleId: number;
  phoneNumber: string;
  email: string;
  appPassword: string;
  subject: string;
  body: string;
  resumeFile?: File;
  resumeFilePath?: string;
  isActive?: boolean;
}

export interface CreateEmailSettingRequest {
  key: string;
  value: string;
}
