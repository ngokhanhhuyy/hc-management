using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Orders;

public class OrderBasicResponseDto : IResponseDto
{
    #region Constructors
    internal OrderBasicResponseDto(Order order)
    {
        Id = order.Id;
        ItemAmount = order.CachedItemAmount;
        IsFinished = order.FinishedDateTime is not null;
    }
    #endregion

    #region Properties
    public int Id { get; }
    public long ItemAmount { get; }
    public bool IsFinished { get; }
    #endregion
}
