using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Orders;

public class OrderItemUpsertRequestDto : IRequestDto
{
    #region Properties
    public int Id { get; set; }
    public long AmountBeforeVatPerUnit { get; set; }
    public int VatPercentagePerUnit { get; set; }
    public int Quantity { get; set; }
    public int MenuItemId { get; set; }
    #endregion

    #region Methods
    public void TransformValues() { }
    #endregion
}
