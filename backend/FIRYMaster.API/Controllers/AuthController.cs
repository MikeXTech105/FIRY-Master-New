using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IConfiguration _configuration; 

        public AuthController(AuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            LoginResponseDto response = new LoginResponseDto();
            try
            {
                response = await _authService.Login(request);
                response.Token = GenerateTokenJWT(request.Email);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }
        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser(UserRequest request)
        {
            APIResponseDto response = new APIResponseDto();
            try
            {
                response = await _authService.CreateUser(request);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }

        private string GenerateTokenJWT(string email)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var claims = new[] { new Claim(ClaimTypes.Email, email) };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
