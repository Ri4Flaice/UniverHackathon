using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Database.Entities;
using UniverHackathon.WebApi.Enums;
using UniverHackathon.WebApi.Models.User;

namespace UniverHackathon.WebApi.Business.User;

public class CreateUser
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<UserEntity> _userManager;

    public CreateUser(AppDbContext dbContext, UserManager<UserEntity> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    public async Task<bool> CreateUserInDb(CreateUserRequest request)
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            var existingUser = await _dbContext
                .UserEntities
                .AnyAsync(user => user.PhoneNumber == request.PhoneNumber);

            if (existingUser)
                throw new Exception("Такой пользователь уже существует");

            var newUser = new UserEntity
            {
                UserName = request.PhoneNumber,
                PhoneNumber = request.PhoneNumber,
                AccountType = AccountType.User,
                FullName = request.FullName,
                Login = request.Login,
                Email = request.Email,
            };
            
            var createUser = await _userManager.CreateAsync(
                newUser,
                request.Password ?? throw new Exception("Пароль пуст"));

            if (!createUser.Succeeded)
            {
                var errors = string.Join(", ", createUser.Errors.Select(e => e.Description));
                throw new Exception($"Пользователь не создан: {errors}");
            }

            await transaction.CommitAsync();
            await _dbContext.SaveChangesAsync();
            
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            await transaction.RollbackAsync();
            throw;
        }
    }
}