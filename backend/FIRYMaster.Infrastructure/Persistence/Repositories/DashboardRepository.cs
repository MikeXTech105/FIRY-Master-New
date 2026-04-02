using Dapper;
using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Interfaces;
using FIRYMaster.Infrastructure.Persistence.DbConnection;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace FIRYMaster.Infrastructure.Persistence.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly DapperContext _context;
        public DashboardRepository(DapperContext context)
        {
            _context = context;
        }
        public async Task<EmailSectionResponce> EmailSection()
        {
            EmailSectionResponce responce = new EmailSectionResponce();
            using (var connection = _context.CreateConnection())
            {
                responce = await connection.QueryFirstAsync<EmailSectionResponce>("sp_GetEmailSection", commandType: CommandType.StoredProcedure);
            }
            return responce;
        }
        public async Task<DashboardResponse> EmailCandidateSection(EmailCandidateSectionRes request)
        {
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@StartDate", request.StartDate);
                parameters.Add("@EndDate", request.EndDate);

                using (var multi = await connection.QueryMultipleAsync(
                    "sp_GetEmailDashboardReport",
                    parameters,
                    commandType: CommandType.StoredProcedure))
                {
                    var summary = await multi.ReadFirstOrDefaultAsync<EmailSummary>();
                    var candidateReports = (await multi.ReadAsync<CandidateReport>()).ToList();
                    var roleReports = (await multi.ReadAsync<RoleReport>()).ToList();
                    var dailyTrends = (await multi.ReadAsync<DailyTrend>()).ToList();

                    return new DashboardResponse
                    {
                        Summary = summary,
                        CandidateReports = candidateReports,
                        RoleReports = roleReports,
                        DailyTrends = dailyTrends
                    };
                }
            }
        }
    }
}
