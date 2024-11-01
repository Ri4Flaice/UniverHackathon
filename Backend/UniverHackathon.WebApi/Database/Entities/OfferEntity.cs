using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniverHackathon.WebApi.Database.Entities;

[Table("offers")]
public class OfferEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long OfferId { get; set; }
    
    [ForeignKey(nameof(UserEntity))]
    public Guid UserId { get; set; }
    
    public string? Topic { get; set; }
    
    public string? Description { get; set; }
    
    public UserEntity? UserEntity { get; set; }
}