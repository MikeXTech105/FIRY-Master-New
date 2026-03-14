using FIRYMaster.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.Interfaces
{
    public interface ICandidateRepository
    {
        Task<CandidateResponseDto> CreateCandidate(CandidateRequestDto Request);
        Task<List<CandidateRequestDto>> GetCandidate();
        Task<CandidateResponseDto> DeleteCandidate(int ID);
        Task<CandidateResponseDto> IsActiveCandidate(int ID, bool IsActive);
    }
}
