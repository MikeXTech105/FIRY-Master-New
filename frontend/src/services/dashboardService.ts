import api from "./api";

export interface DashboardStats {
  totalEmailQueue: number;
  todayEmailQueue: number;
  todaySentEmail: number;
  todayFailedEmail: number;
}

export interface CandidateReport {
  appCandidateID: number;
  candidateName: string;
  totalEmails: number;
  sentEmails: number;
  pendingEmails: number;
}

export interface RoleReport {
  appRoleID: number;
  roleName: string;
  totalEmails: number;
  sentEmails: number;
  pendingEmails: number;
}

export interface DailyTrend {
  emailDate: string;
  totalEmails: number;
  sentEmails: number;
  pendingEmails: number;
}

export interface EmailCandidateSectionResponse {
  summary: {
    totalEmails: number;
    emailsSent: number;
    pendingEmails: number;
  };
  candidateReports: CandidateReport[];
  roleReports: RoleReport[];
  dailyTrends: DailyTrend[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get("/Dashboard");
  return res.data;
};

export const getEmailCandidateSection = async (
  startDate: string | null,
  endDate: string | null
): Promise<EmailCandidateSectionResponse> => {
  const res = await api.post("/Dashboard/EmailCandidateSection", {
    startDate,
    endDate,
  });
  return res.data;
};