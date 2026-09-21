using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Orders;

public class OrderUpsertRequestDto : IRequestDto
{
    #region Properties
    public int SeatingId { get; set; }
    public List<OrderItemUpsertRequestDto> Items { get; set; } = new();
    #endregion

    #region Methods
    public void TransformValues() { }
    #endregion
}
