using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.DTOs
{
    public class EmailResponseDto
    {
        public int StatusCode { get; set; }

        public string Message { get; set; }

        public string Emails { get; set; }
    }
    public class GetEmailResponseDto
    {
        public int TotalRecords { get; set; }
        public List<Emaillst> Data { get; set; }
    }
    public class Emaillst
    {
        public string Email { get; set; }
        public string RoleName { get; set; }
    }
}
