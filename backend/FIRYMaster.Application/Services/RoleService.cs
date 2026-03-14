using FIRYMaster.Application.Common;
using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.Services
{
    public class RoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public async Task<RoleResponseDto> CreateRole(string RoleName)
        {
            return await _roleRepository.CreateRole(RoleName);
        }

        public async Task<RoleResponseDto> DeleteRole(int ID)
        {
            return await _roleRepository.DeleteRole(ID);
        }
        public async Task<RoleResponseDto> ActiveRole(int ID, bool IsActive)
        {
            return await _roleRepository.ActiveRole(ID, IsActive);
        }

        public async Task<List<RoleRes>> GetRoles()
        {
            return await _roleRepository.GetRoles();
        }
    }
}
