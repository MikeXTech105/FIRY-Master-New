using FIRYMaster.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.Interfaces
{
    public interface IDashboardRepository
    {
        Task<EmailSectionResponce> EmailSection();
        Task<DashboardResponse> EmailCandidateSection(EmailCandidateSectionRes request);
    }
}
