using FIRYMaster.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.Interfaces
{
    public interface IEmailRepository
    {
        Task<EmailResponseDto> AddEmails(EmailRequestDto Request);
        Task<GetEmailResponseDto> GetEmail(GetEmailDto Request);
    }
}
