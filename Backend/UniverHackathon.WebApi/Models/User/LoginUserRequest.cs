using System.ComponentModel.DataAnnotations;

namespace UniverHackathon.WebApi.Models.User;

public class LoginUserRequest
{
    [Required]
    [MaxLength(12)]
    public string? PhoneNumber { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string? Password { get; set; }
}