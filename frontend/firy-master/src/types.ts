export type Role = {
  id: number;
  roleName: string;
  isActive?: boolean;
};

export type Candidate = {
  id: number;
  name: string;
  roleId?: number;
  phoneNumber: string;
  email: string;
  appPassword?: string;
  subject: string;
  body?: string;
  resumeFilePath?: string;
  resumeFile?: File | null;
  isActive: boolean;
};

export type EmailRecord = {
  id: number;
  email: string;
  roleId?: number;
  roleName?: string;
};

export type EmailQueryParams = {
  searchText: string;
  roleId: number;
  pageNumber: number;
  pageSize: number;
};

export type AddEmailsPayload = {
  emails: string;
  roleId: number;
};

export type EmailSetting = {
  id: number;
  key: string;
  value: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
