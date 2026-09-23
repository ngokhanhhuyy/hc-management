using Microsoft.EntityFrameworkCore;
using HCManagement.Core.Features.MenuCategories;
using HCManagement.Core.Features.MenuItems;
using HCManagement.Core.Features.Users;
using HCManagement.Core.Persistence.DbContext;
using HCManagement.Core.Common.Time;
using System.Text.Json;

namespace HCManagement.Core.Persistence.Seeders;

internal class MenuItemSeeder
{
    #region Fields
    private readonly AppDbContext _context;
    private readonly IClock _clock;
    private readonly IHostEnvironment _environment;
    private readonly ILogger<MenuItemSeeder> _logger;
    private MenuSeedData? _menuData = null;
    #endregion

    #region Constructors
    public MenuItemSeeder(
        AppDbContext context,
        IClock clock,
        IHostEnvironment environment,
        ILogger<MenuItemSeeder> logger)
    {
        _context = context;
        _clock = clock;
        _environment = environment;
        _logger = logger;
    }
    #endregion

    #region Methods
    public async Task<List<MenuItem>> SeedAsync(List<User> users)
    {
        List<MenuCategory> menuCategories = await SeedMenuCategoriesAsync();
        return await SeedMenuItemsAsync(users, menuCategories);
    }
    #endregion
    
    #region PrivateMethods
    private async Task<List<MenuItem>> SeedMenuItemsAsync(List<User> users, List<MenuCategory> menuCategories)
    {
        List<MenuItem> menuItems = await _context.MenuItems.ToListAsync();
            
        if (menuItems.Count > 0)
        {
            return menuItems;
        }

        _logger.LogInformation("Seeding MenuItems.");

        MenuSeedData menuData = await GetMenuDataAsync();
        foreach (MenuItem menuItem in menuData.MenuItems)
        {
            menuItem.CreatedUser = users.OrderBy(_ => Guid.NewGuid()).First();
            menuItem.CreatedDateTime = _clock.Now;
        }

        _context.MenuItems.AddRange(menuData.MenuItems);

        await _context.SaveChangesAsync();
        return menuItems;
    }

    private async Task<List<MenuCategory>> SeedMenuCategoriesAsync()
    {
        List<MenuCategory> menuCategories = await _context.MenuCategories.ToListAsync();

        if (menuCategories.Count > 0)
        {
            return menuCategories;
        }

        _logger.LogInformation("Seeding MenuCategories.");

        MenuSeedData menuData = await GetMenuDataAsync();
        MenuCategory? drinkCategory = null;
        for (int index = 0; index < menuData.MenuCategories.Count; index += 1)
        {
            MenuCategory category = menuData.MenuCategories[index];
            if (category.Name is "Nước Uống")
            {
                drinkCategory = category;
                continue;
            }

            category.Index = index;
        }

        drinkCategory?.Index = menuData.MenuCategories.Max(mc => mc.Index);

        _context.MenuCategories.AddRange(menuData.MenuCategories);

        await _context.SaveChangesAsync();
        return menuCategories;
    }

    private async Task<MenuSeedData> GetMenuDataAsync()
    {
        if (_menuData is null)
        {
            string rootPath = _environment.ContentRootPath;
            string jsonFilePath = Path.Combine(rootPath, "Core", "Persistence", "Seeders", "MenuData.json");
            _menuData = await MenuSeedData.LoadFromJsonAsync(jsonFilePath);
        }

        return _menuData;
    }
    #endregion
}

internal class MenuSeedData
{
    #region Properties
    public List<MenuCategory> MenuCategories { get; set; } = new();
    public List<MenuItem> MenuItems { get; set; } = new();
    #endregion

    #region StaticMethods
    public static async Task<MenuSeedData> LoadFromJsonAsync(string jsonFilePath)
    {
        string jsonContent = await File.ReadAllTextAsync(jsonFilePath);
        return JsonSerializer.Deserialize<MenuSeedData>(jsonContent) ?? new();
    }
    #endregion
}
