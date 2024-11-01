using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniverHackathon.WebApi.Business.Event;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Database.Entities;
using UniverHackathon.WebApi.Enums;
using UniverHackathon.WebApi.Models.Event;
using UniverHackathon.WebApi.Models.Roles;

namespace UniverHackathon.WebApi.Controllers;

[ApiController]
[Route("api/[controller]/")]
public class EventController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public EventController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("getFilter")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<List<EventEntity>> EventFilter(
        [FromQuery] EventStatus? eventStatus,
        [FromQuery] string? name,
        [FromQuery] DateTime? dateStart,
        [FromQuery] DateTime? dateEnd)
    {
        var eventFilterConstructor = new EventsFilter(_dbContext);

        var filterParameters = new EventParameters
        {
            EventStatus = eventStatus,
            Name = name,
            DateStart = dateStart,
            DateEnd = dateEnd
        };

        return await eventFilterConstructor.GetFilteredEvents(filterParameters);
    }

    [HttpPost("getAnalytics")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<GetEventAnalyticsResponse> GetEventAnalytics(List<EventModel>? events)
    {
        var getEventAnalyticsConstructor = new GetEventAnalytics(_dbContext);

        return await getEventAnalyticsConstructor.GetAnalytics(events);
    }

    [HttpDelete("deleteInvalid")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<bool> DeleteInvalidEvent([FromQuery] long eventId)
    {
        var deleteInvalidEventConstructor = new DeleteInvalidEvent(_dbContext);

        return await deleteInvalidEventConstructor.DeleteInvalidEventInDb(eventId);
    }
}