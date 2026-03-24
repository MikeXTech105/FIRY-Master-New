import api from "./api";

export interface DashboardStats {
  totalEmailQueue: number;
  todayEmailQueue: number;
  todaySentEmail: number;
  todayFailedEmail: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get("/Dashboard");
  return res.data;
};