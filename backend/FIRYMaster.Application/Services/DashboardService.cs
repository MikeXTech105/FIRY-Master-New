using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.Services
{
    public class DashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;
        public DashboardService(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }
        public async Task<EmailSectionResponce> EmailSection()
        {
            return await _dashboardRepository.EmailSection();
        }
    }
}
