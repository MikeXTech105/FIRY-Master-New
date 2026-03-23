using Dapper;
using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Interfaces;
using FIRYMaster.Infrastructure.Persistence.DbConnection;
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
    }
}
