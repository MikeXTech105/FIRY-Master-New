using System;
using System.Collections.Generic;
using System.Text;

namespace FIRYMaster.Application.DTOs
{
    public class EmailRequestDto
    {
        public string Emails { get; set; }
        public int RoleId { get; set; }
    }
    public class GetEmailDto
    {
        public string? SearchText { get; set; }
        public int? RoleId { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
