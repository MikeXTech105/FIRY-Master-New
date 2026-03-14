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
    public class CandidateRepository : ICandidateRepository
    {
        private readonly DapperContext _context;

        public CandidateRepository(DapperContext dapperContext)
        {
            _context = dapperContext;
        }
        public async Task<CandidateResponseDto> CreateCandidate(CandidateRequestDto Request)
        {
            CandidateResponseDto response = new CandidateResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Name", Request.Name);
                parameters.Add("@RoleId", Request.RoleId);
                parameters.Add("@PhoneNumber", Request.PhoneNumber);
                parameters.Add("@Email", Request.Email);
                parameters.Add("@AppPassword", Request.AppPassword);
                parameters.Add("@Subject", Request.Subject);
                parameters.Add("@Body", Request.Body);
                parameters.Add("@ResumeFilePath", Request.ResumeFilePath);

                response = await connection.QueryFirstAsync<CandidateResponseDto>("sp_CreateCandidate", parameters, commandType: CommandType.StoredProcedure);
            }
            return response;

        }
        public async Task<List<CandidateRequestDto>> GetCandidate()
        {
            List<CandidateRequestDto> lstRes = new List<CandidateRequestDto>();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                lstRes = (await connection.QueryAsync<CandidateRequestDto>("sp_GetCandidate", commandType: CommandType.StoredProcedure)).ToList();
            }
            return lstRes;
        }
        public async Task<CandidateResponseDto> DeleteCandidate(int ID)
        {
            CandidateResponseDto response = new CandidateResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Id", ID);
                response = await connection.QueryFirstAsync<CandidateResponseDto>("sp_DeleteCandidate", parameters, commandType: CommandType.StoredProcedure);
            }
            return response;
        }
        public async Task<CandidateResponseDto> IsActiveCandidate(int ID, bool IsActive)
        {
            CandidateResponseDto response = new CandidateResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Id", ID);
                parameters.Add("@IsActive", IsActive);
                response = await connection.QueryFirstAsync<CandidateResponseDto>("sp_IsActiveCandidate", parameters, commandType: CommandType.StoredProcedure);
            }
            return response;
        }
    }
}
