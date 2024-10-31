namespace UniverHackathon.WebApi.Models.Offer;

public class OffersResponse
{
    public long OfferId { get; set; }
    public string? Topic { get; set; }
    
    public string? Description { get; set; }
    
    public Guid UserId { get; set; }
}