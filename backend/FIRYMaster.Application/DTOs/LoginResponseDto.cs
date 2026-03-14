using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.DTOs
{
    public class LoginResponseDto
    {
        public int StatusCode { get; set; }

        public string Message { get; set; }
        public string Token { get; set; }
    }
    public class APIResponseDto
    {
        public int StatusCode { get; set; }

        public string Message { get; set; }

    }
}
