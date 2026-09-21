using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Orders;

public class OrderListResponseDto : IPaginatedListResponseDto<OrderBasicResponseDto>
{
    #region Constructors
    internal OrderListResponseDto(List<OrderBasicResponseDto> items, int pageCount, int itemCount)
    {
        Items = items;
        PageCount = pageCount;
        ItemCount = itemCount;
    }
    #endregion

    #region Properties
    public List<OrderBasicResponseDto> Items { get; }
    public int PageCount { get; }
    public int ItemCount { get; }
    #endregion
}
