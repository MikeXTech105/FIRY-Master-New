using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.DTOs
{
    public class EmailSectionResponce
    {
        public int TotalEmailQueue { get; set; }
        public int TodayEmailQueue { get; set; }
        public int TodaySentEmail { get; set; }
        public int TodayFailedEmail { get; set; }
    }
    public class EmailCandidateSectionRes
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
    public class EmailSummary
    {
        public int TotalEmails { get; set; }
        public int EmailsSent { get; set; }
        public int PendingEmails { get; set; }
    }
    public class CandidateReport
    {
        public int AppCandidateID { get; set; }
        public string CandidateName { get; set; }
        public int TotalEmails { get; set; }
        public int SentEmails { get; set; }
        public int PendingEmails { get; set; }
    }
    public class RoleReport
    {
        public int AppRoleID { get; set; }
        public string RoleName { get; set; }
        public int TotalEmails { get; set; }
        public int SentEmails { get; set; }
        public int PendingEmails { get; set; }
    }
    public class DailyTrend
    {
        public DateTime EmailDate { get; set; }
        public int TotalEmails { get; set; }
        public int SentEmails { get; set; }
        public int PendingEmails { get; set; }
    }
    public class DashboardResponse
    {
        public EmailSummary Summary { get; set; }
        public List<CandidateReport> CandidateReports { get; set; }
        public List<RoleReport> RoleReports { get; set; }
        public List<DailyTrend> DailyTrends { get; set; }
    }
}
