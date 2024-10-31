using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Enums;
using UniverHackathon.WebApi.Models.Event;

namespace UniverHackathon.WebApi.Business.Event;

public class DeleteInvalidEvent
{
    private readonly AppDbContext _dbContext;

    public DeleteInvalidEvent(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> DeleteInvalidEventInDb(EventModel eventModel)
    {
        var existingEvent = await _dbContext
            .EventEntities
            .SingleOrDefaultAsync(e => e.EventId == eventModel.EventId);

        if (existingEvent == null)
            throw new Exception("Не найдено событие");

        var existingUser = await _dbContext
            .UserEntities
            .SingleOrDefaultAsync(user => user.Id == existingEvent.UserId);

        if (existingUser == null)
            throw new Exception("Не найден пользователь");

        existingUser.Rating = existingEvent.EventStatus switch
        {
            EventStatus.Emergency => Math.Max(existingUser.Rating - 8, 0),
            EventStatus.LandscapingOfTheCity => Math.Max(existingUser.Rating - 4, 0),
            EventStatus.Usual => Math.Max(existingUser.Rating - 2, 0),
            _ => existingUser.Rating
        };

        _dbContext.EventEntities.Remove(existingEvent);

        await _dbContext.SaveChangesAsync();

        return true;
    }
}