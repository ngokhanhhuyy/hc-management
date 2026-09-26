namespace HCManagement.Core.Features.MenuCategories;

public class MenuCategoryBasicResponseDto
{
    #region Properties
    public int Id { get; }
    public string Name { get; }
    public int? SortingIndex { get; }
    #endregion

    #region Constructors
    internal MenuCategoryBasicResponseDto(MenuCategory category)
    {
        Id = category.Id;
        Name = category.Name;
        SortingIndex = category.SortingIndex;
    }
    #endregion
}
