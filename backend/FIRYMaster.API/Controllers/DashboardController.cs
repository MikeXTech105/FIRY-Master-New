using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Services;
using FIRYMaster.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;
        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }
        [HttpGet]
        public async Task<IActionResult> EmailSection()
        {
            EmailSectionResponce response = new EmailSectionResponce();
            try
            {
                response = await _dashboardService.EmailSection();
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }
    }
}
