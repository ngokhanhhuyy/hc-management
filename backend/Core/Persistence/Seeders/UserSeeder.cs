using Microsoft.EntityFrameworkCore;
using HCManagement.Core.Common.Security;
using HCManagement.Core.Features.Users;
using HCManagement.Core.Persistence.DbContext;

namespace HCManagement.Core.Persistence.Seeders;

internal class UserSeeder
{
    #region Fields
    private readonly AppDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<UserSeeder> _logger;
    #endregion

    #region Constructors
    public UserSeeder(AppDbContext context, IPasswordHasher passwordHasher, ILogger<UserSeeder> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }
    #endregion

    #region Methods
    public async Task<List<User>> SeedAsync()
    {
        return await SeedUsersAsync();
    }
    #endregion
    
    #region PrivateMethods
    private async Task<List<User>> SeedUsersAsync()
    {
        List<User> users = await _context.Users.ToListAsync();
            
        if (users.Count > 0)
        {
            return users;
        }

        _logger.LogInformation("Seeding users.");

        users.Add(new ()
        {
            UserName = "ngokhanhhuyy",
            PasswordHash = _passwordHasher.HashPassword("huy123")
        });
        

        users.Add(new ()
        {
            UserName = "admin",
            PasswordHash = _passwordHasher.HashPassword("admin123")
        });

        _context.Users.AddRange(users);
        await _context.SaveChangesAsync();
        return users;
    }
    #endregion
}
