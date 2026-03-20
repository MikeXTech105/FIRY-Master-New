using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.Services
{
    public class EmailSettingsService
    {
        private readonly IEmailSettingsRepository _emailSettingsRepository;
        public EmailSettingsService(IEmailSettingsRepository emailSettingsRepository)
        {
            _emailSettingsRepository = emailSettingsRepository;
        }
        public async Task<List<EmailSettings>> GetEamilSettings()
        {
            return await _emailSettingsRepository.GetEamilSettings();
        }
        public async Task<APIResponseDto> CreateEmailSettings(string Key, string Value)
        {
            return await _emailSettingsRepository.CreateEmailSettings(Key, Value);
        }
        public async Task<APIResponseDto> DeleteEmailSetting(int Id)
        {
            return await _emailSettingsRepository.DeleteEmailSetting(Id);
        }

    }
}
