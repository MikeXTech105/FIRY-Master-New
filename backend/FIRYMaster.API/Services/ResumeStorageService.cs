using FIRYMaster.API.Configuration;
using Microsoft.Extensions.Options;

namespace FIRYMaster.API.Services;

public class ResumeStorageService : IResumeStorageService
{
    private readonly FileUploadOptions _options;
    private readonly ILogger<ResumeStorageService> _logger;

    public ResumeStorageService(IOptions<FileUploadOptions> options, ILogger<ResumeStorageService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public async Task<string> SaveAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        ValidateFile(file);

        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Resumes");
        Directory.CreateDirectory(folderPath);

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var safeFileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(folderPath, safeFileName);

        await using var stream = new FileStream(filePath, FileMode.CreateNew, FileAccess.Write, FileShare.None);
        await file.CopyToAsync(stream, cancellationToken);

        _logger.LogInformation("Saved resume file {StoredFileName} ({Size} bytes)", safeFileName, file.Length);

        return $"/Resumes/{safeFileName}";
    }

    private void ValidateFile(IFormFile? file)
    {
        if (file is null)
        {
            throw new InvalidDataException("Resume file is required.");
        }

        if (file.Length == 0)
        {
            throw new InvalidDataException("Resume file is empty.");
        }

        if (file.Length > _options.MaxResumeSizeBytes)
        {
            throw new InvalidDataException($"Resume size exceeds {_options.MaxResumeSizeBytes / (1024 * 1024)} MB limit.");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowed = new HashSet<string>(_options.AllowedResumeExtensions.Select(x => x.ToLowerInvariant()));

        if (!allowed.Contains(extension))
        {
            throw new InvalidDataException($"Resume extension '{extension}' is not allowed.");
        }
    }
}
