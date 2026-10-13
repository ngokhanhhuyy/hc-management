using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.MenuItems;

public class MenuItemListResponseDto : IPaginatedListResponseDto<MenuItemBasicResponseDto>
{
    #region Constructors
    internal MenuItemListResponseDto(List<MenuItemBasicResponseDto> items, int itemCount, int pageCount)
    {
        Items = items;
        ItemCount = itemCount;
        PageCount = pageCount;
    } 
    #endregion

    #region Properties
    public List<MenuItemBasicResponseDto> Items { get; }
    public int ItemCount { get; }
    public int PageCount { get; }
    #endregion
}
