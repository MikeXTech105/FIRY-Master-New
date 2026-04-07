using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AuthService _authService;
        public UsersController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] UserRequest request)
        {
            var response = await _authService.CreateUser(request);
            return Ok(response);
        }
        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var response = await _authService.GetUsers();
            return Ok(response);
        }
        [HttpGet("UserIsActive")]
        public async Task<IActionResult> UserIsActive(int Id, bool IsActive)
        {
            var response = await _authService.UserIsActive(Id, IsActive);
            return Ok(response);
        }
        [HttpPost("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserRequest request)
        {
            var response = await _authService.UpdateUser(request);
            return Ok(response);
        }
    }
}
