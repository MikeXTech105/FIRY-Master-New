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
    public class EmailRepository : IEmailRepository
    {
        private readonly DapperContext _context;
        public EmailRepository(DapperContext context)
        {
            _context = context;
        }
        public async Task<EmailResponseDto> AddEmails(EmailRequestDto request)
        {
            EmailResponseDto response = new EmailResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Emails", request.Emails);
                parameters.Add("@RoleID", request.RoleId);
                response = await connection.QueryFirstAsync<EmailResponseDto>("sp_AddEmails", parameters, commandType: CommandType.StoredProcedure);
            }
            return response;
        }

        public async Task<GetEmailResponseDto> GetEmail(GetEmailDto Request)
        {
            GetEmailResponseDto responce = new GetEmailResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@SearchText", Request.SearchText);
                parameters.Add("@RoleId", Request.RoleId);
                parameters.Add("@PageNumber", Request.PageNumber);
                parameters.Add("@PageSize", Request.PageSize);

                using (var result = await connection.QueryMultipleAsync("sp_GetEmails", parameters, commandType: CommandType.StoredProcedure))
                {
                    responce.Data = (await result.ReadAsync<Emaillst>()).ToList();
                    responce.TotalRecords = await result.ReadFirstAsync<int>();
                }
            }
            return responce;
        }
    }
}
