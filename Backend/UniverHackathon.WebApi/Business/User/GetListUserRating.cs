using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Models.User;

namespace UniverHackathon.WebApi.Business.User;

public class GetListUserRating
{
    private readonly AppDbContext _dbContext;

    public GetListUserRating(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<UserRating>> GetUsersRating()
    {
        return await _dbContext
            .UserEntities
            .Select(user => new UserRating
            {
                FullName = user.FullName,
                Rating = user.Rating,
            })
            .OrderByDescending(user => user.Rating)
            .ToListAsync();
    }
}