namespace HCManagement.Core.Features.MenuCategories;

public interface IMenuCategoryService
{
    #region Methods
    Task<List<MenuCategoryBasicResponseDto>> GetAllAsync();
    Task<MenuCategoryBasicResponseDto> GetSingleAsync(int id);
    Task<int> CreateAsync(MenuCategoryUpsertRequestDto requestDto);
    Task UpdateAsync(int id, MenuCategoryUpsertRequestDto requestDto);
    Task DeleteAsync(int id);
    #endregion
}
