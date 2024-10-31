using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace UniverHackathon.WebApi.Database.Entities;

[Table("users")]
public class UserEntity : IdentityUser<Guid>
{
    [MaxLength(50)]
    public string? FullName { get; set; }
}