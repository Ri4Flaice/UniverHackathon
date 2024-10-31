using UniverHackathon.WebApi.Enums;

namespace UniverHackathon.WebApi.Models.Event;

public class EventParameters
{
    public EventStatus? EventStatus { get; set; }
    public string? Name { get; set; }
    public DateTime? DateStart { get; set; }
    public DateTime? DateEnd { get; set; }
}