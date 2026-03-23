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
    public class EmailSettingsRepository : IEmailSettingsRepository
    {
        private readonly DapperContext _context;
        public EmailSettingsRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<List<EmailSettings>> GetEamilSettings()
        {
            List<EmailSettings> lstRoles = new List<EmailSettings>();
            using (var connection = _context.CreateConnection())
            {
                lstRoles = (await connection.QueryAsync<EmailSettings>("sp_GetEmailSettings", commandType: CommandType.StoredProcedure)).ToList();
            }
            return lstRoles;
        }
        public async Task<APIResponseDto> CreateEmailSettings(string Key, string Value)
        {
            APIResponseDto response = new APIResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Key", Key);
                parameters.Add("@Value", Value);
                response = await connection.QueryFirstAsync<APIResponseDto>("sp_CreateEmailSettings", parameters, commandType: CommandType.StoredProcedure);
            }
            return response;
        }
        public async Task<APIResponseDto> UpdateEmailSettings(EmailSettings request)
        {
            APIResponseDto response = new APIResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Id", request.Id);
                parameters.Add("@Key", request.Key);
                parameters.Add("@Value", request.Value);
                response = await connection.QueryFirstAsync<APIResponseDto>("sp_UpdateEmailSettings", parameters, commandType: CommandType.StoredProcedure);
            }
            return response;
        }
        public async Task<APIResponseDto> DeleteEmailSetting(int Id)
        {
            APIResponseDto response = new APIResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Id", Id);
                response = await connection.QueryFirstAsync<APIResponseDto>("sp_DeleteEmailSetting", parameters, commandType: CommandType.StoredProcedure);
            }
            return response;
        }
    }
}
 