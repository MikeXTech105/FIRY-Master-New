using Dapper;
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
    }
}
