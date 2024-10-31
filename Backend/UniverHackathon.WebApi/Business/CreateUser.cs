using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Database.Entities;

namespace UniverHackathon.WebApi.Business;

public class CreateUser
{
    private readonly AppDbContext _dbContext;

    public CreateUser(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Guid> CreateUserInDb(string? fullName)
    {
        var newUser = new UserEntity
        {
            FullName = fullName
        };

        _dbContext.UserEntities.Add(newUser);
        await _dbContext.SaveChangesAsync();

        return newUser.Id;
    }
}