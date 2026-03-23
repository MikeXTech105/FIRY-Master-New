using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.Services
{
    public class CandidateService
    {
        private readonly ICandidateRepository _candidateRepository;
        public CandidateService(ICandidateRepository candidateRepository)
        {
            _candidateRepository = candidateRepository;
        }

        public async Task<CandidateResponseDto> CreateCandidate(CandidateRequestDto Request)
        {
            return await _candidateRepository.CreateCandidate(Request);
        }
        public async Task<List<CandidateRequestDto>> GetCandidate()
        {
            return await _candidateRepository.GetCandidate();
        }
        public async Task<CandidateResponseDto> DeleteCandidate(int ID)
        {
            return await _candidateRepository.DeleteCandidate(ID);
        }
        public async Task<CandidateResponseDto> IsActiveCandidate(int ID, bool IsActive)
        {
            return await _candidateRepository.IsActiveCandidate(ID,IsActive);
        }
        public async Task<APIResponseDto> UpdateCandidate(UpdateCandidateRequest request)
        {
            return await _candidateRepository.UpdateCandidate(request);
        }
    }
}
