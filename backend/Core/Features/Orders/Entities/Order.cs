using HCManagement.Core.Features.Seatings;
using HCManagement.Core.Features.Users;
using System.ComponentModel.DataAnnotations;

namespace HCManagement.Core.Features.Orders;

internal class Order
{
    #region Properties
    [Key]
    public int Id { get; private set; }

    [Required]
    public long CachedItemAmount { get; private set; }
    
    [Required]
    public required DateTime CreatedDateTime { get; set; }

    [Required]
    public DateTime? LastUpdatedDateTime { get; set; }

    [Required]
    public DateTime? FinishedDateTime { get; set; }

    [Required]
    public DateTime? DeletedDateTime { get; set; }
    #endregion

    #region ForeignKeyProperties
    [Required]
    public int CreatedUserId { get; set; }

    public int? LastUpdatedUserId { get; set; }

    public int? FinishedUserId { get; set; }

    public int? DeletedUserId { get; set; }

    [Required]
    public int SeatingId { get; set; }
    #endregion

    #region NavigationProperties
    public User CreatedUser { get; set; } = null!;
    public User? LastUpdatedUser { get; set; }
    public User? FinishedUser { get; set; }
    public User? DeletedUser { get; set; }
    public Seating Seating { get; set; } = null!;
    public List<OrderItem> Items { get; set; } = new();
    #endregion
}
