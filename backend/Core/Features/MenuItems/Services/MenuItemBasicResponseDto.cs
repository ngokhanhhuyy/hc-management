using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Features.MenuCategories;

namespace HCManagement.Core.Features.MenuItems;

public class MenuItemBasicResponseDto : IResponseDto
{
    #region Constructors
    internal MenuItemBasicResponseDto(MenuItem menuItem)
    {
        Id = menuItem.Id;
        Name = menuItem.Name;
        Unit = menuItem.Unit;
        DefaultAmountBeforeVatPerUnit = menuItem.DefaultAmountBeforeVatPerUnit;
        DefaultVatPercentagePerUnit = menuItem.DefaultVatPercentagePerUnit;
        IsDeleted = menuItem.DeletedDateTime is not null;

        if (menuItem.Category is not null)
        {
            Category = new(menuItem.Category);
        }
    }
    #endregion

    #region #Properties
    public int Id { get; }
    public string Name { get; }
    public string Unit { get; }
    public long DefaultAmountBeforeVatPerUnit { get; }
    public int DefaultVatPercentagePerUnit { get; }
    public MenuCategoryBasicResponseDto? Category { get; }
    public bool IsDeleted { get; }
    #endregion
}
