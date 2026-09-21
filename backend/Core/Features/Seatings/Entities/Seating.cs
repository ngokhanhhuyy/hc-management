using HCManagement.Core.Features.Orders;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq.Expressions;

namespace HCManagement.Core.Features.Seatings;

internal class Seating
{
    #region Properties
    [Key]
    public int Id { get; private set; }

    [Required]
    [StringLength(SeatingContracts.NameMaxLength)]
    public required string Name { get; set; }

    [Required]
    public bool IsDeleted { get; set; }
    #endregion

    #region NavigationProperties
    public List<Order> Orders { get; set; } = new();
    #endregion

    #region ComputedProperties
    [NotMapped]
    public Order? ActiveOrder => Orders.SingleOrDefault(o => o.FinishedDateTime is null);
    #endregion

    #region StaticProperties
    public static Expression<Func<Order, bool>> ActiveOrderFilterExpression => (o) => o.FinishedDateTime == null;
    #endregion
}
