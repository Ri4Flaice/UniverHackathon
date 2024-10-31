using System.ComponentModel.DataAnnotations;

namespace UniverHackathon.WebApi.Models.Offer;

public class CreateOfferRequest
{
    [Required]
    public string? Topic { get; set; }
    
    public string? Description { get; set; }
}