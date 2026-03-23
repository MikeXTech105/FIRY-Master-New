using Dapper;
using FIRYMaster.Application.Common;
using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Interfaces;
using FIRYMaster.Infrastructure.Persistence.DbConnection;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace FIRYMaster.Infrastructure.Persistence.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly DapperContext _context;
        public RoleRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<RoleResponseDto> CreateRole(string RoleName)
        {
            RoleResponseDto res = new RoleResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@RoleName", RoleName);
                res = await connection.QueryFirstAsync<RoleResponseDto>("sp_CreateRole", parameters, commandType: CommandType.StoredProcedure);
            }
            return res;
        }
        public async Task<List<RoleRes>> GetRoles()
        {
            List<RoleRes> lstRoles = new List<RoleRes>();
            using (var connection = _context.CreateConnection())
            {
                lstRoles = (await connection.QueryAsync<RoleRes>("sp_GetRole", commandType: CommandType.StoredProcedure)).ToList();
            }
            return lstRoles;
        }
        public async Task<RoleResponseDto> DeleteRole(int ID)
        {
            RoleResponseDto res = new RoleResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ID", ID);
                res = await connection.QueryFirstAsync<RoleResponseDto>("sp_DeleteRole", parameters, commandType: CommandType.StoredProcedure);
            }
            return res;
        }
        public async Task<RoleResponseDto> ActiveRole(int ID, bool IsActive)
        {
            RoleResponseDto res = new RoleResponseDto();
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ID", ID);
                parameters.Add("@IsActive", IsActive);
                res = await connection.QueryFirstAsync<RoleResponseDto>("sp_ActiveRole", parameters, commandType: CommandType.StoredProcedure);
            }
            return res;
        }
    }
}
