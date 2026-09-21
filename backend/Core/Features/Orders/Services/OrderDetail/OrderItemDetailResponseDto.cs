using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Features.MenuItems;

namespace HCManagement.Core.Features.Orders;

public class OrderItemDetailResponseDto : IResponseDto
{
    #region Constructors
    internal OrderItemDetailResponseDto(OrderItem orderItem)
    {
        Id = orderItem.Id;
        AmountBeforeVatPerUnit = orderItem.AmountBeforeVatPerUnit;
        VatPercentagePerUnit = orderItem.VatPercentagePerUnit;
        Quantity = orderItem.Quantity;
        MenuItem = new(orderItem.MenuItem);
    }
    #endregion

    #region Properties
    public int Id { get; }
    public long AmountBeforeVatPerUnit { get; }
    public int VatPercentagePerUnit { get; }
    public int Quantity { get; }
    public MenuItemBasicResponseDto MenuItem { get; }
    #endregion
}
