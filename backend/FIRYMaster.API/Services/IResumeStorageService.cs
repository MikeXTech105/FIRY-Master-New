using Microsoft.AspNetCore.Http;

namespace FIRYMaster.API.Services;

public interface IResumeStorageService
{
    Task<string> SaveAsync(IFormFile file, CancellationToken cancellationToken = default);
}
