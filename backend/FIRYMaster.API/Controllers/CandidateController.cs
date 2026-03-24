using FIRYMaster.API.Services;
using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class CandidateController : ControllerBase
    {
        private readonly CandidateService _candidateService;
        private readonly IResumeStorageService _resumeStorageService;

        public CandidateController(CandidateService candidateService, IResumeStorageService resumeStorageService)
        {
            _candidateService = candidateService;
            _resumeStorageService = resumeStorageService;
        }

        [HttpPost("CreateCandidate")]
        [RequestSizeLimit(20 * 1024 * 1024)]
        public async Task<IActionResult> CreateCandidate([FromForm] CandidateRequestDto model, CancellationToken cancellationToken)
        {
            model.ResumeFilePath = await _resumeStorageService.SaveAsync(model.ResumeFile, cancellationToken);
            var response = await _candidateService.CreateCandidate(model);
            return Ok(response);
        }

        [HttpGet("GetCandidate")]
        public async Task<IActionResult> GetCandidate()
        {
            var response = await _candidateService.GetCandidate();
            return Ok(response);
        }

        [HttpPost("DeleteCandidate")]
        public async Task<IActionResult> DeleteCandidate([FromQuery] int id)
        {
            var response = await _candidateService.DeleteCandidate(id);
            return Ok(response);
        }

        [HttpPost("IsActiveCandidate")]
        public async Task<IActionResult> IsActiveCandidate([FromQuery] int id, [FromQuery] bool isActive)
        {
            var response = await _candidateService.IsActiveCandidate(id, isActive);
            return Ok(response);
        }

        [HttpGet("view-resume")]
        public IActionResult ViewResume([FromQuery] string resumeFilePath)
        {
            if (string.IsNullOrWhiteSpace(resumeFilePath))
            {
                return BadRequest("File path required");
            }

            var fileName = Path.GetFileName(resumeFilePath);
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "Resumes", fileName);

            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound();
            }

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return File(stream, "application/pdf");
        }

        [HttpPost("UpdateCandidate")]
        [RequestSizeLimit(20 * 1024 * 1024)]
        public async Task<IActionResult> UpdateCandidate([FromForm] UpdateCandidateRequest request, CancellationToken cancellationToken)
        {
            if (request.ResumeFile is not null)
            {
                request.ResumeFilePath = await _resumeStorageService.SaveAsync(request.ResumeFile, cancellationToken);
            }

            var response = await _candidateService.UpdateCandidate(request);
            return Ok(response);
        }
    }
}
