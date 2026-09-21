using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Features.Orders;

namespace HCManagement.Core.Features.Seatings;

public class SeatingDetailResponseDto : IResponseDto
{
    #region Constructors
    internal SeatingDetailResponseDto(Seating seating)
    {
        Id = seating.Id;
        Name = seating.Name;

        if (seating.ActiveOrder is not null)
        {
            ActiveOrder = new(seating.ActiveOrder);
        }
    }
    #endregion

    #region Properties
    public int Id { get; }
    public string Name { get; }
    public OrderBasicResponseDto? ActiveOrder { get; }
    #endregion
}
