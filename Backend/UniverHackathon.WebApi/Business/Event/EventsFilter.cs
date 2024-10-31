using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Database.Entities;
using UniverHackathon.WebApi.Models.Event;

namespace UniverHackathon.WebApi.Business.Event;

public class EventsFilter
{
    private readonly AppDbContext _dbContext;

    public EventsFilter(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<EventEntity>> GetFilteredEvents(EventParameters parameters)
    {
        IQueryable<EventEntity> query = _dbContext.EventEntities;
        
        if (parameters.EventStatus.HasValue)
            query = query.Where(e => e.EventStatus == parameters.EventStatus.Value);

        if (!string.IsNullOrEmpty(parameters.Name))
            query = query.Where(e => e.Name != null && e.Name.Contains(parameters.Name));

        if (parameters.DateStart.HasValue)
            query = query.Where(e => e.DateStart >= parameters.DateStart.Value);

        if (parameters.DateEnd.HasValue)
            query = query.Where(e => e.DateEnd <= parameters.DateEnd.Value);

        return await query.ToListAsync();
    }
}