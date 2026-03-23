using FIRYMaster.Application.DTOs;
using FIRYMaster.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<LoginResponseDto> Login(string email, string passwordHash);
        Task<APIResponseDto> CreateUser(UserRequest request);
    }
}
