using System.ComponentModel.DataAnnotations;

namespace UniverHackathon.WebApi.Models.User;

public class CreateUserRequest
{
    [Required]
    [MaxLength(12)]
    public string? PhoneNumber { get; set; }

    [Required]
    [MaxLength(50)]
    public string? Password { get; set; }

    [MaxLength(100)]
    public string? FullName { get; set; }

    [MaxLength(100)]
    public string? Login { get; set; }

    [MaxLength(150)]
    public string? Email { get; set; }
}