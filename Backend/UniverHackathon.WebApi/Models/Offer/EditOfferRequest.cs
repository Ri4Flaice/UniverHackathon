using System.ComponentModel.DataAnnotations;

namespace UniverHackathon.WebApi.Models.Offer;

public class EditOfferRequest
{
    [Required]
    public long OfferId { get; set; }
    
    public string? Topic { get; set; }
    
    public string? Description { get; set; }
    
    public bool? Reviewed { get; set; }
    
    public Guid UserId { get; set; }
}