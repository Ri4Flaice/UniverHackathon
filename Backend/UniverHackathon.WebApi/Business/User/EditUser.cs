using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Database.Entities;
using UniverHackathon.WebApi.Models.User;

namespace UniverHackathon.WebApi.Business.User;

public class EditUser
{
    private readonly AppDbContext _dbContext;

    public EditUser(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UserEntity> EditUserInDb(EditUserRequest request)
    {
        var existingUser = await _dbContext
            .UserEntities
            .SingleOrDefaultAsync(user => user.PhoneNumber == request.CurrentPhoneNumber);

        if (existingUser == null)
            throw new Exception("Пользователь не найден");

        existingUser.PhoneNumber = request.NewPhoneNumber ?? existingUser.PhoneNumber;
        existingUser.FullName = request.FullName ?? existingUser.FullName;
        existingUser.Login = request.Login ?? existingUser.Login;
        existingUser.Email = request.Email ?? existingUser.Email;
        existingUser.AccountType = request.AccountType ?? existingUser.AccountType;

        _dbContext.UserEntities.Update(existingUser);
        await _dbContext.SaveChangesAsync();

        return existingUser;
    }
}