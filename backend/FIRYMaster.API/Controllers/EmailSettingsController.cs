using Azure;
using Azure.Core;
using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Services;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailSettingsController : ControllerBase
    {
        private readonly EmailSettingsService _emailSettingsService;
        public EmailSettingsController(EmailSettingsService emailSettingsService)
        {
            _emailSettingsService = emailSettingsService;
        }
        [HttpGet("GetEmailSettings")]
        public async Task<IActionResult> GetEamilSettings()
        {
            List<EmailSettings> response = new List<EmailSettings>();
            try
            {
                response = await _emailSettingsService.GetEamilSettings();
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }

        [HttpPost("CreateEmailSetting")]
        public async Task<IActionResult> CreateEmailSetting(string Key, string Value)
        {
            APIResponseDto response = new APIResponseDto();
            try
            {
                response = await _emailSettingsService.CreateEmailSettings(Key, Value);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }
        [HttpPost("DeleteEmailSetting")]
        public async Task<IActionResult> DeleteEmailSetting(int Id)
        {
            APIResponseDto response = new APIResponseDto();
            try
            {
                response = await _emailSettingsService.DeleteEmailSetting(Id);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }

        [HttpPost("UpdateEmailSettings")]
        public async Task<IActionResult> UpdateEmailSettings([FromBody]EmailSettings request)
        {
            APIResponseDto response = new APIResponseDto();
            try
            {
                response = await _emailSettingsService.UpdateEmailSettings(request);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }
    }
}
