using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Text;

namespace FIRYMaster.Application.Services
{
    public class EmailService
    {
        private readonly IEmailRepository _emailRepository;
        public EmailService(IEmailRepository emailRepository)
        {
            _emailRepository = emailRepository;
        }
        public async Task<EmailResponseDto> AddEmails(EmailRequestDto request)
        {
            return await _emailRepository.AddEmails(request);
        }
        public async Task<GetEmailResponseDto> GetEmail (GetEmailDto Request)
        {
            return await _emailRepository.GetEmail(Request);
        }
    }
}
