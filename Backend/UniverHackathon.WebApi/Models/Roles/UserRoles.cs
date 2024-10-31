namespace UniverHackathon.WebApi.Models.Roles;

public class UserRoles
{
    public const string Default = nameof(Default);

    public const string Admin = nameof(Admin);

    public const string User = nameof(User);

    public const string StateEmployee = nameof(StateEmployee);
    
    public static readonly string[] RolesList = [Default, Admin, User, StateEmployee];
}