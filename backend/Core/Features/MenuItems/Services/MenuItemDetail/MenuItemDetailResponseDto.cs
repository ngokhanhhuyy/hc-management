using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Features.MenuCategories;
using HCManagement.Core.Features.Users;

namespace HCManagement.Core.Features.MenuItems;

public class MenuItemDetailResponseDto : IResponseDto
{
    #region Constructors
    internal MenuItemDetailResponseDto(MenuItem menuItem)
    {
        Id = menuItem.Id;
        Name = menuItem.Name;
        Unit = menuItem.Unit;
        DefaultAmountBeforeVatPerUnit = menuItem.DefaultAmountBeforeVatPerUnit;
        DefaultVatPercentagePerUnit = menuItem.DefaultVatPercentagePerUnit;
        CreatedUser = new(menuItem.CreatedUser);
        CreatedDateTime = menuItem.CreatedDateTime;
        LastUpdatedDateTime = menuItem.LastUpdatedDateTime;
        DeletedDateTime = menuItem.DeletedDateTime;

        if (menuItem.Category is not null)
        {
            Category = new(menuItem.Category);
        }

        if (menuItem.LastUpdatedUser is not null)
        {
            LastUpdatedUser = new(menuItem.LastUpdatedUser);
        }

        if (menuItem.DeletedUser is not null)
        {
            DeletedUser = new(menuItem.DeletedUser);
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
    public UserBasicResponseDto CreatedUser { get; }
    public DateTime CreatedDateTime { get; }
    public UserBasicResponseDto? LastUpdatedUser { get; }
    public DateTime? LastUpdatedDateTime { get; }
    public UserBasicResponseDto? DeletedUser { get; }
    public DateTime? DeletedDateTime { get; }
    #endregion
}
