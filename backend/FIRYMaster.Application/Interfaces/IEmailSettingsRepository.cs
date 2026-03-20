using FIRYMaster.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.Interfaces
{
    public interface IEmailSettingsRepository
    {
        Task<List<EmailSettings>> GetEamilSettings();
        Task<APIResponseDto> CreateEmailSettings(string Key, string Value);
        Task<APIResponseDto> DeleteEmailSetting(int Id);
    }
}
