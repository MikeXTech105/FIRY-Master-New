
using Microsoft.AspNetCore.Http;

namespace FIRYMaster.Application.DTOs
{
    public class CandidateRequestDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int RoleId { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string AppPassword { get; set; }

        public string Subject { get; set; }

        public string Body { get; set; }

        public IFormFile ResumeFile { get; set; }
        public string? ResumeFilePath { get; set; }
        public bool? IsActive { get; set; }
    }
}
