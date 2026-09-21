using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Features.Orders;

namespace HCManagement.Core.Features.Seatings;

public class SeatingBasicResponseDto : IResponseDto
{
    #region Constructors
    internal SeatingBasicResponseDto(Seating seating)
    {
        Id = seating.Id;
        Name = seating.Name;
        IsDeleted = seating.IsDeleted;

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
    public bool IsDeleted { get; }
    #endregion
}
