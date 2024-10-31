using System.ComponentModel.DataAnnotations;
using UniverHackathon.WebApi.Enums;

namespace UniverHackathon.WebApi.Models.User;

public class EditUserRequest
{
    [Required]
    [MaxLength(12)]
    public string? CurrentPhoneNumber { get; set; }

    [MaxLength(12)]
    public string? NewPhoneNumber { get; set; }
    
    [MaxLength(100)]
    public string? FullName { get; set; }

    [MaxLength(100)]
    public string? Login { get; set; }

    [MaxLength(150)]
    public string? Email { get; set; }
    
    [EnumDataType(typeof(AccountType))]
    public AccountType? AccountType { get; set; }
}