using Microsoft.EntityFrameworkCore;
using HCManagement.Core.Features.Seatings;
using HCManagement.Core.Persistence.DbContext;

namespace HCManagement.Core.Persistence.Seeders;

internal class SeatingSeeder
{
    #region Fields
    private readonly AppDbContext _context;
    private readonly ILogger<SeatingSeeder> _logger;
    #endregion

    #region Constructors
    public SeatingSeeder(AppDbContext context, ILogger<SeatingSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }
    #endregion

    #region Methods
    public async Task<List<Seating>> SeedAsync()
    {
        return await SeedSeatingsAsync();
    }
    #endregion
    
    #region PrivateMethods
    private async Task<List<Seating>> SeedSeatingsAsync()
    {
        List<Seating> seatings = await _context.Seatings.ToListAsync();
            
        if (seatings.Count > 0)
        {
            return seatings;
        }

        _logger.LogInformation("Seeding Seatings.");

        for (int index = 0; index < 30; index += 1)
        {
            Seating seating = new()
            {
                Name = $"Bàn {index + 1}",
            };

            seatings.Add(seating);
        }

        _context.Seatings.AddRange(seatings);

        await _context.SaveChangesAsync();
        return seatings;
    }
    #endregion
}
