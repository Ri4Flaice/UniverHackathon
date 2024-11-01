using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Enums;
using UniverHackathon.WebApi.Models.Event;

namespace UniverHackathon.WebApi.Business.Event;

public class GetEventAnalytics
{
    private readonly AppDbContext _dbContext;

    public GetEventAnalytics(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GetEventAnalyticsResponse> GetAnalytics(List<EventModel>? events = null)
    {
        var eventList = events ?? await _dbContext.EventEntities
            .Select(e => new EventModel
            {
                EventStatus = e.EventStatus,
            })
            .ToListAsync();

        var numberEventEmergency = eventList.Count(e => e.EventStatus == EventStatus.Emergency);
        var numberEventLandscapingOfTheCity = eventList.Count(e => e.EventStatus == EventStatus.LandscapingOfTheCity);
        var numberEventUsual = eventList.Count(e => e.EventStatus == EventStatus.Usual);

        return new GetEventAnalyticsResponse
        {
            NumberEventEmergency = numberEventEmergency,
            NumberEventLandscapingOfTheCity = numberEventLandscapingOfTheCity,
            NumberEventUsual = numberEventUsual,
        };
    }
}