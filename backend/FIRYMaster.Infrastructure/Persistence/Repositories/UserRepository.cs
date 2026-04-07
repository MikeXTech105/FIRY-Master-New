using Azure.Core;
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
        public async Task<APIResponseDto> GetUsers()
        {
            APIResponseDto response = new APIResponseDto();
            List<Users> users = new List<Users>();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@StatusCode", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("@Message", dbType: DbType.String, direction: ParameterDirection.Output);
                users = (await connection.QueryAsync<Users>("sp_GetUsers", commandType: CommandType.StoredProcedure)).ToList();
                response = new APIResponseDto
                {
                    StatusCode = parameters.Get<int>("@StatusCode"),
                    Message = parameters.Get<string>("@Message"),
                    Data = users,
                };
            }
            return response;
        }
        public async Task<APIResponseDto> UserIsActive(int Id, bool IsActive)
        {
            APIResponseDto response = new APIResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Id", Id);
                parameters.Add("@IsActive", IsActive);
                parameters.Add("@StatusCode", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("@Message", dbType: DbType.String, direction: ParameterDirection.Output);
                _ = await connection.QueryAsync("sp_UserIsAvtive", commandType: CommandType.StoredProcedure);
                response = new APIResponseDto
                {
                    StatusCode = parameters.Get<int>("@StatusCode"),
                    Message = parameters.Get<string>("@Message")
                };
            }
            return response;
        }
        public async Task<APIResponseDto> UpdateUser(UserRequest request)
        {
            APIResponseDto response = new APIResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@Id", request.Id);
                parameters.Add("@FirstName", request.FirstName);
                parameters.Add("@LastName", request.LastName);
                parameters.Add("@Email", request.Email);
                parameters.Add("@StatusCode", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("@Message", dbType: DbType.String, direction: ParameterDirection.Output);
                _ = await connection.QueryFirstAsync("sp_UpdateUser", commandType: CommandType.StoredProcedure);
                response = new APIResponseDto
                {
                    StatusCode = parameters.Get<int>("@StatusCode"),
                    Message = parameters.Get<string>("@Message")
                };
            }
            return response;
        }
    }
}
