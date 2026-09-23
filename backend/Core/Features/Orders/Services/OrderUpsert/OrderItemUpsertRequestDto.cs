using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Orders;

public class OrderItemUpsertRequestDto : IRequestDto
{
    #region Properties
    public required int? Id { get; set; }
    public required long AmountBeforeVatPerUnit { get; set; }
    public required int VatPercentagePerUnit { get; set; }
    public required int Quantity { get; set; }
    public required int MenuItemId { get; set; }
    #endregion

    #region Methods
    public void TransformValues() { }
    #endregion
}
