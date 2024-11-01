using UniverHackathon.WebApi.Enums;

namespace UniverHackathon.WebApi.Models.Event;

public class EventModel
{
    public long? EventId { get; set; }
    public string? Name { get; set; }
    public EventStatus? EventStatus { get; set; }
    public DateTime? DateEnd { get; set; }
    public DateTime? DateStart { get; set; }
    public string? Address { get; set; }
    public string? Coordinates { get; set; }
    public string? Description { get; set; }
    public IFormFile? Photo { get; set; }
}