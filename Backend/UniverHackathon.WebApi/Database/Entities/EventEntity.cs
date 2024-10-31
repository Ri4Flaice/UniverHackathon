using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using UniverHackathon.WebApi.Enums;

namespace UniverHackathon.WebApi.Database.Entities;

[Table("events")]
public class EventEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long EventId { get; set; }
    
    [ForeignKey(nameof(UserEntity))]
    public Guid UserId { get; set; }

    [MaxLength(200)]
    public string? Name { get; set; }
    
    [MaxLength(400)]
    public string? Description { get; set; }
    
    public DateTime DateStart { get; set; }
    
    public DateTime DateEnd { get; set; }
    
    [MaxLength(150)]
    public string? Address { get; set; }
    
    [MaxLength(20)]
    public string? Coordinates { get; set; }
    
    public EventStatus EventStatus { get; set; }
    
    public byte[]? Photo { get; set; }
    public UserEntity? UserEntity { get; set; }
}