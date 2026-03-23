using Azure;
using FIRYMaster.Application.DTOs;
using FIRYMaster.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Bcpg.Sig;
using System.Net;
using System.Reflection;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;

namespace FIRYMaster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CandidateController : ControllerBase
    { 
        private readonly CandidateService _candidateService;
        public CandidateController(CandidateService candidateService)
        {
            _candidateService = candidateService;
        }

        [HttpPost("CreateCandidate")]
        public async Task<IActionResult> CreateCandidate([FromForm] CandidateRequestDto model)
        {
            CandidateResponseDto response = new CandidateResponseDto();
            try
            {
                string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Resumes");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string originalFileName = Path.GetFileNameWithoutExtension(model.ResumeFile.FileName);     
                string extension = Path.GetExtension(model.ResumeFile.FileName);

                string fileName = model.ResumeFile.FileName;
                string filePath = Path.Combine(folderPath, fileName);

                int count = 1;

                while (System.IO.File.Exists(filePath))
                {
                    fileName = $"{originalFileName}({count}){extension}";
                    filePath = Path.Combine(folderPath, fileName);
                    count++;
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ResumeFile.CopyToAsync(stream);
                }

                model.ResumeFilePath = "/Resumes/" + fileName;

                response = await _candidateService.CreateCandidate(model);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }

            return this.StatusCode((int)HttpStatusCode.OK, response);
        }

        [HttpGet("GetCandidate")]
        public async Task<IActionResult> GetCandidate()
        {
            List<CandidateRequestDto> response = new List<CandidateRequestDto>();
            try
            {
                response = await _candidateService.GetCandidate();
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }

        [HttpPost("DeleteCandidate")]
        public async Task<IActionResult> DeleteCandidate(int ID)
        {
            CandidateResponseDto response = new CandidateResponseDto();
            try
            {
                response = await _candidateService.DeleteCandidate(ID);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }

        [HttpPost("IsActiveCandidate")]
        public async Task<IActionResult> IsActiveCandidate(int ID, bool IsActive)
        {
            CandidateResponseDto response = new CandidateResponseDto();
            try
            {
                response = await _candidateService.IsActiveCandidate(ID, IsActive);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }

        [HttpGet("view-resume")]
        public IActionResult ViewResume(string resumeFilePath)
        {
            if (string.IsNullOrEmpty(resumeFilePath))
                return BadRequest("File path required");

            var fileName = Path.GetFileName(resumeFilePath);

            var fullPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "Resumes",
                fileName
            );

            if (!System.IO.File.Exists(fullPath))
                return NotFound();

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);

            return File(stream, "application/pdf");
        }

        [HttpPost("UpdateCandidate")]
        public async Task<IActionResult> UpdateCandidate([FromForm] UpdateCandidateRequest request)
        {
            APIResponseDto response = new APIResponseDto();
            try
            {
                if(request.ResumeFile != null)
                {
                    string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Resumes");

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string originalFileName = Path.GetFileNameWithoutExtension(request.ResumeFile.FileName);
                    string extension = Path.GetExtension(request.ResumeFile.FileName);

                    string fileName = request.ResumeFile.FileName;
                    string filePath = Path.Combine(folderPath, fileName);

                    int count = 1;

                    while (System.IO.File.Exists(filePath))
                    {
                        fileName = $"{originalFileName}({count}){extension}";
                        filePath = Path.Combine(folderPath, fileName);
                        count++;
                    }

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.ResumeFile.CopyToAsync(stream);
                    }

                    request.ResumeFilePath = "/Resumes/" + fileName;
                }
                response = await _candidateService.UpdateCandidate(request);
            }
            catch (Exception ex)
            {
                return this.StatusCode((int)HttpStatusCode.InternalServerError, ex.ToString());
            }
            return this.StatusCode((int)HttpStatusCode.OK, response);
        }
    }
}
