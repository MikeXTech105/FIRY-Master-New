using FIRYMaster.Application.Common;
using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Interfaces;
using FIRYMaster.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Text;

namespace FIRYMaster.Application.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<LoginResponseDto> Login(LoginRequestDto request)
        {
            var hashPassword = PasswordHasher.GenerateHash(request.Password);

            return await _userRepository.Login(request.Email, hashPassword);
        }
        public async Task<APIResponseDto> CreateUser(UserRequest request)
        {
            var hashPassword = PasswordHasher.GenerateHash(request.Password);
            request.Password = hashPassword;

            return await _userRepository.CreateUser(request);
        }
        public async Task<APIResponseDto> GetUsers()
        {
            return await _userRepository.GetUsers();
        }
        public async Task<APIResponseDto> UserIsActive(int Id, bool IsActive)
        {
            return await _userRepository.UserIsActive(Id, IsActive);
        }
        public async Task<APIResponseDto> UpdateUser(UserRequest request)
        {
            return await _userRepository.UpdateUser(request);
        }
    }
}
