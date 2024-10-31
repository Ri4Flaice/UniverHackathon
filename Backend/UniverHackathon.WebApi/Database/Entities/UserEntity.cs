using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using UniverHackathon.WebApi.Enums;

namespace UniverHackathon.WebApi.Database.Entities;

[Table("users")]
public class UserEntity : IdentityUser<Guid>
{
    [MaxLength(100)]
    public string? FullName { get; set; }
    
    [MaxLength(100)]
    public string? Login { get; set; }
    
    public DateTime DateRegistration { get; set; }
    
    public bool Status { get; set; }
    public AccountType AccountType { get; set; }
}