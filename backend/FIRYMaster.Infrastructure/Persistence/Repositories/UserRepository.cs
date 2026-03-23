using Dapper;
using FIRYMaster.Application.Common;
using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Interfaces;
using FIRYMaster.Domain.Entities;
using FIRYMaster.Infrastructure.Persistence.DbConnection;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace FIRYMaster.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DapperContext _context;

        public UserRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<LoginResponseDto> Login(string email, string passwordHash)
        {
            LoginResponseDto responseDto = new LoginResponseDto();
            using (var connection = _context.CreateConnection())
            {

                var parameters = new DynamicParameters();

                parameters.Add("@Email", email);
                parameters.Add("@PasswordHash", passwordHash);

                responseDto = await connection.QueryFirstAsync<LoginResponseDto>("sp_LoginUser", parameters, commandType: CommandType.StoredProcedure);
            }
            return responseDto;
        }
        public async Task<APIResponseDto> CreateUser(UserRequest request)
        {
           APIResponseDto response = new APIResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();

                parameters.Add("@FirstName", request.FirstName);
                parameters.Add("@LastName", request.LastName);
                parameters.Add("@Email", request.Email);
                parameters.Add("@Password", request.Password);

                response = await connection.QueryFirstAsync<APIResponseDto>("sp_CreateUser", parameters, commandType: CommandType.StoredProcedure);
            }
            return response;
        }
    }
}
