using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace FIRYMaster.Application.DTOs
{
    public class CandidateRequestDto
    {
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int RoleId { get; set; }

        [Required, MaxLength(30)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        public string AppPassword { get; set; } = string.Empty;

        [Required, MaxLength(300)]
        public string Subject { get; set; } = string.Empty;

        [Required, MaxLength(4000)]
        public string Body { get; set; } = string.Empty;

        [Required]
        public IFormFile ResumeFile { get; set; } = default!;

        public string? ResumeFilePath { get; set; }

        public bool? IsActive { get; set; }
    }

    public class UpdateCandidateRequest
    {
        [Range(1, int.MaxValue)]
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int RoleId { get; set; }

        [Required, MaxLength(30)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        public string AppPassword { get; set; } = string.Empty;

        [Required, MaxLength(300)]
        public string Subject { get; set; } = string.Empty;

        [Required, MaxLength(4000)]
        public string Body { get; set; } = string.Empty;

        public IFormFile? ResumeFile { get; set; }

        public string? ResumeFilePath { get; set; }

        public bool? IsActive { get; set; }
    }
}
