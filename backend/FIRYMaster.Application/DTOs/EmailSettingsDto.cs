using System.ComponentModel.DataAnnotations;

namespace FIRYMaster.Application.DTOs
{
    public class EmailSettings
    {
        [Range(1, int.MaxValue)]
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string Key { get; set; } = string.Empty;

        [Required, MaxLength(2000)]
        public string Value { get; set; } = string.Empty;
    }

    public class CreateEmailSettingRequest
    {
        [Required, MaxLength(200)]
        public string Key { get; set; } = string.Empty;

        [Required, MaxLength(2000)]
        public string Value { get; set; } = string.Empty;
    }
}
