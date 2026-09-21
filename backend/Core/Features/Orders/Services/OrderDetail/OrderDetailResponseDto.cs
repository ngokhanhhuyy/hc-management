using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Features.Seatings;
using HCManagement.Core.Features.Users;

namespace HCManagement.Core.Features.Orders;

public class OrderDetailResponseDto : IResponseDto
{
    #region Constructors
    internal OrderDetailResponseDto(Order order)
    {
        Id = order.Id;
        CreatedDateTime = order.CreatedDateTime;
        LastUpdatedDateTime = order.LastUpdatedDateTime;
        FinishedDateTime = order.FinishedDateTime;
        ItemAmount = order.Items.Sum(oi => oi.AmountAfterVat);
        Items = order.Items.Select(oi => new OrderItemDetailResponseDto(oi)).ToList();
        CreatedUser = new(order.CreatedUser);
        Seating = new(order.Seating);

        if (order.LastUpdatedUser is not null)
        {
            LastUpdatedUser = new(order.LastUpdatedUser);
        }

        if (order.FinishedUser is not null)
        {
            FinishedUser = new(order.FinishedUser);
        }
    }
    #endregion

    #region Properties
    public int Id { get; }
    public DateTime CreatedDateTime { get; }
    public DateTime? LastUpdatedDateTime { get; }
    public DateTime? FinishedDateTime { get; }
    public long ItemAmount { get; }
    public List<OrderItemDetailResponseDto> Items { get; }
    public UserBasicResponseDto CreatedUser { get; }
    public UserBasicResponseDto? LastUpdatedUser { get; }
    public UserBasicResponseDto? FinishedUser { get; }
    public SeatingBasicResponseDto Seating { get; }
    #endregion
}
