using Azure;
using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;
        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("AddEmails")]
        public async Task<IActionResult> AddEmails(EmailRequestDto request)
        {
            EmailResponseDto response = new EmailResponseDto();
            try
            {
                response = await _emailService.AddEmails(request);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }

            return this.StatusCode((int)HttpStatusCode.OK, response);
        }
        [HttpPost("GetEmail")]
        public async Task<IActionResult> GetEmail(GetEmailDto request) 
        {
            GetEmailResponseDto response = new GetEmailResponseDto();
            try
            {
                response = await _emailService.GetEmail(request);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }
    }
}
