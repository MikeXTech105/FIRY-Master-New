using FIRYMaster.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _roleService;

        public RoleController(RoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpPost("CreateRole")]
        public async Task<IActionResult> CreateRole([FromQuery] string roleName)
        {
            var response = await _roleService.CreateRole(roleName);
            return Ok(response);
        }

        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleService.GetRoles();
            return Ok(roles);
        }

        [HttpPost("DeleteRole")]
        public async Task<IActionResult> DeleteRole([FromQuery] int id)
        {
            var response = await _roleService.DeleteRole(id);
            return Ok(response);
        }

        [HttpPost("ActiveRole")]
        public async Task<IActionResult> ActiveRole([FromQuery] int id, [FromQuery] bool isActive)
        {
            var response = await _roleService.ActiveRole(id, isActive);
            return Ok(response);
        }
    }
}
