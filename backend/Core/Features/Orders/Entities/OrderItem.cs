using HCManagement.Core.Features.MenuItems;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HCManagement.Core.Features.Orders;

internal class OrderItem
{
    #region Properties
    [Key]
    public int Id { get; private set; }
    
    [Required]
    public long AmountBeforeVatPerUnit { get; set; }
    
    [Required]
    public int VatPercentagePerUnit { get; set; }

    [Required]
    public int Quantity { get; set; }
    #endregion

    #region ForeignKeyProperties
    [Required]
    public int OrderId { get; set; }

    [Required]
    public int MenuItemId { get; set; }
    #endregion

    #region NavigationProperties
    public Order Order { get; set; } = null!;
    public MenuItem MenuItem { get; set; } = null!;
    #endregion

    #region ComputedProperties
    [NotMapped]
    public long VatAmountPerUnit =>
        (long)Math.Round((double)AmountBeforeVatPerUnit * (VatPercentagePerUnit / 100) / 1000) * 1000; 

    [NotMapped]
    public long AmountAfterVatPerUnit => AmountBeforeVatPerUnit + VatAmountPerUnit;

    [NotMapped]
    public long AmountAfterVat => AmountAfterVat * Quantity;
    #endregion
}
