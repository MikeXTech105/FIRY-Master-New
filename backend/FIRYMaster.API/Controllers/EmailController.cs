using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("AddEmails")]
        public async Task<IActionResult> AddEmails([FromBody] EmailRequestDto request)
        {
            var response = await _emailService.AddEmails(request);
            return Ok(response);
        }

        [HttpPost("GetEmail")]
        public async Task<IActionResult> GetEmail([FromBody] GetEmailDto request)
        {
            var response = await _emailService.GetEmail(request);
            return Ok(response);
        }
    }
}
