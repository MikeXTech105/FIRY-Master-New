using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class EmailSettingsController : ControllerBase
    {
        private readonly EmailSettingsService _emailSettingsService;

        public EmailSettingsController(EmailSettingsService emailSettingsService)
        {
            _emailSettingsService = emailSettingsService;
        }

        [HttpGet("GetEmailSettings")]
        public async Task<IActionResult> GetEmailSettings()
        {
            var response = await _emailSettingsService.GetEamilSettings();
            return Ok(response);
        }

        [HttpPost("CreateEmailSetting")]
        public async Task<IActionResult> CreateEmailSetting([FromBody] CreateEmailSettingRequest request)
        {
            var response = await _emailSettingsService.CreateEmailSettings(request.Key, request.Value);
            return Ok(response);
        }

        [HttpPost("DeleteEmailSetting")]
        public async Task<IActionResult> DeleteEmailSetting([FromQuery] int id)
        {
            var response = await _emailSettingsService.DeleteEmailSetting(id);
            return Ok(response);
        }

        [HttpPost("UpdateEmailSettings")]
        public async Task<IActionResult> UpdateEmailSettings([FromBody] EmailSettings request)
        {
            var response = await _emailSettingsService.UpdateEmailSettings(request);
            return Ok(response);
        }
    }
}
