namespace HCManagement.Core.Features.MenuCategories;

public class MenuCategoryBasicResponseDto
{
    #region Properties
    public int Id { get; }
    public string Name { get; }
    #endregion

    #region Constructors
    internal MenuCategoryBasicResponseDto(MenuCategory category)
    {
        Id = category.Id;
        Name = category.Name;
    }
    #endregion
}
