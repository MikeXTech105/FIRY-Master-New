using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.DTOs
{
    public class RoleResponseDto
    {
        public int StatusCode { get; set; }

        public string Message { get; set; }
    }
    public class RoleRes
    {
        public int id { get; set; }
        public string RoleName { get; set; }
        public bool IsActive { get; set; }
    }
}
