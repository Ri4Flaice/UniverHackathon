using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;

namespace UniverHackathon.WebApi.Business.User;

public class AddUserRating
{
    private readonly AppDbContext _dbContext;

    public AddUserRating(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> AddUserRatingForOffer(Guid userId)
    {
        var existingUser = await _dbContext
            .UserEntities
            .FirstOrDefaultAsync(user => user.Id == userId);

        if (existingUser == null)
            throw new Exception("Пользователь не найден");

        existingUser.Rating += 3;

        await _dbContext.SaveChangesAsync();

        return true;
    }
}