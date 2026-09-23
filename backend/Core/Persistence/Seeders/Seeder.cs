using Microsoft.EntityFrameworkCore.Storage;
using HCManagement.Core.Features.MenuItems;
using HCManagement.Core.Features.Seatings;
using HCManagement.Core.Features.Users;
using HCManagement.Core.Persistence.DbContext;

namespace HCManagement.Core.Persistence.Seeders;

internal class Seeder
{
    #region Fields
    private readonly AppDbContext _context;
    private readonly MenuItemSeeder _menuItemSeeder;
    private readonly SeatingSeeder _seatingSeeder;
    private readonly UserSeeder _userSeeder;
    private readonly ILogger<Seeder> _logger;
    #endregion

    #region Constructors
    public Seeder(
        AppDbContext context,
        MenuItemSeeder menuItemSeeder,
        SeatingSeeder seatingSeeder,
        UserSeeder userSeeder,
        ILogger<Seeder> logger)
    {
        _context = context;
        _menuItemSeeder = menuItemSeeder;
        _seatingSeeder = seatingSeeder;
        _userSeeder = userSeeder;
        _logger = logger;
    }
    #endregion

    #region Methods
    public async Task SeedAsync(bool isDevelopment)
    {
        _logger.LogInformation("Seeding started.");

        await using IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync();
        List<User> users = await _userSeeder.SeedAsync();
        List<Seating> seatings = await _seatingSeeder.SeedAsync();

        if (isDevelopment)
        {
            List<MenuItem> menuItems = await _menuItemSeeder.SeedAsync(users);
        }
        
        _logger.LogInformation("Seeding ended.");

        await transaction.CommitAsync();
    }
    #endregion
}
