using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _roleService;

        public RoleController(RoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpPost("CreateRole")]
        public async Task<IActionResult> CreateRole(string RoleName)
        {
            RoleResponseDto response = new RoleResponseDto();
            try
            {
                response = await _roleService.CreateRole(RoleName);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }

            return this.StatusCode((int)HttpStatusCode.OK, response);
        }

        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles()
        {
            List<RoleRes> lstRoles = new List<RoleRes>();
            try
            {
                lstRoles = await _roleService.GetRoles();
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, lstRoles);
        }

        [HttpPost("DeleteRole")]
        public async Task<IActionResult> DeleteRole(int ID)
        {
            RoleResponseDto response = new RoleResponseDto();
            try
            {
                response = await _roleService.DeleteRole(ID);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }

        [HttpPost("ActiveRole")]
        public async Task<IActionResult> ActiveRole(int ID, bool IsActive)
        {
            RoleResponseDto response = new RoleResponseDto();
            try
            {
                response = await _roleService.ActiveRole(ID, IsActive);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }
    }
}
