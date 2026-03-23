using FIRYMaster.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.Interfaces
{
    public interface IRoleRepository
    {
        Task<List<RoleRes>> GetRoles();
        Task<RoleResponseDto> CreateRole(string RoleName);
        Task<RoleResponseDto> DeleteRole(int ID);
        Task<RoleResponseDto> ActiveRole(int ID, bool IsActive);
    }
}