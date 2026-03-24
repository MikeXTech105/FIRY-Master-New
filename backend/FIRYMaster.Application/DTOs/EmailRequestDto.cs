using System.ComponentModel.DataAnnotations;

namespace FIRYMaster.Application.DTOs
{
    public class EmailRequestDto
    {
        [Required, MaxLength(4000)]
        public string Emails { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int RoleId { get; set; }
    }

    public class GetEmailDto
    {
        [MaxLength(200)]
        public string? SearchText { get; set; }

        public int? RoleId { get; set; }

        [Range(1, int.MaxValue)]
        public int PageNumber { get; set; } = 1;

        [Range(1, 500)]
        public int PageSize { get; set; } = 20;
    }
}
