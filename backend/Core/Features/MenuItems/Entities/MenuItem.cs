using HCManagement.Core.Common.Extensions;
using HCManagement.Core.Features.MenuCategories;
using HCManagement.Core.Features.Orders;
using HCManagement.Core.Features.Users;
using System.ComponentModel.DataAnnotations;

namespace HCManagement.Core.Features.MenuItems;

internal class MenuItem
{
    #region Properties
    [Key]
    public int Id { get; private set; }

    [Required]
    [StringLength(MenuItemContracts.NameMaxLength)]
    public required string Name
    {
        get;
        set
        {
            field = value;
            NormalizedName = value.ToLower().ToNonDiacritics();
        }
    }

    [Required]
    [StringLength(MenuItemContracts.NameMaxLength)]
    public string NormalizedName { get; private set; } = string.Empty;

    [Required]
    [StringLength(MenuItemContracts.UnitMaxLength)]
    public required string Unit { get; set; }

    [Required]
    public required long DefaultAmountBeforeVatPerUnit { get; set; }

    [Required]
    public required int DefaultVatPercentagePerUnit { get; set; }

    [Required]
    public required DateTime CreatedDateTime { get; set; }

    public DateTime? LastUpdatedDateTime { get; set; }

    public DateTime? DeletedDateTime { get; set; }
    #endregion

    #region ForeignKeys
    public int CreatedUserId { get; set; }
    public int? LastUpdatedUserId { get; set; }
    public int? DeletedUserId { get; set; }
    public int? CategoryId { get; set; }
    #endregion

    #region NavigationProperties
    public User CreatedUser { get; set; } = null!;
    public User? LastUpdatedUser { get; set; }
    public User? DeletedUser { get; set; }
    public MenuCategory? Category { get; set; }
    public List<OrderItem> OrderItems { get; set; } = new();
    #endregion
}
