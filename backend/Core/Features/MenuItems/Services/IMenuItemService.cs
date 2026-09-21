namespace HCManagement.Core.Features.MenuItems;

public interface IMenuItemService
{
    #region Methods
    Task<List<MenuItemBasicResponseDto>> GetListAsync(MenuItemListRequestDto requestDto);
    Task<MenuItemDetailResponseDto> GetDetailAsync(int id);
    Task<int> CreateAsync(MenuItemUpsertRequestDto requestDto);
    Task UpdateAsync(int id, MenuItemUpsertRequestDto requestDto);
    Task DeleteAsync(int id);
    #endregion
}
