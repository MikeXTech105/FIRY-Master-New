using System.ComponentModel.DataAnnotations;

namespace FIRYMaster.API.Configuration;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    [Required]
    public string Key { get; set; } = string.Empty;

    [Required]
    public string Issuer { get; set; } = string.Empty;

    [Required]
    public string Audience { get; set; } = string.Empty;

    [Range(5, 1440)]
    public int DurationInMinutes { get; set; } = 60;
}

public sealed class CorsOptions
{
    public const string SectionName = "Cors";

    [Required]
    public string[] AllowedOrigins { get; set; } = [];
}

public sealed class EmailJobOptions
{
    public const string SectionName = "EmailJob";

    [Range(1, 24)]
    public int RunEveryHours { get; set; } = 1;

    [Range(0, 60)]
    public int MaxRandomDelaySecondsBetweenEmails { get; set; } = 20;
}

public sealed class FileUploadOptions
{
    public const string SectionName = "FileUpload";

    [Range(1024, 20 * 1024 * 1024)]
    public long MaxResumeSizeBytes { get; set; } = 5 * 1024 * 1024;

    [Required]
    public string[] AllowedResumeExtensions { get; set; } = [".pdf", ".doc", ".docx"];
}

public sealed class SmtpOptions
{
    public const string SectionName = "Smtp";

    [Required]
    public string Host { get; set; } = "smtp.gmail.com";

    [Range(1, 65535)]
    public int Port { get; set; } = 587;

    public bool UseStartTls { get; set; } = true;
}
