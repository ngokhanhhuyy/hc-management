using HCManagement.Core.Common.Dtos;

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
    }
    #endregion

    #region #Properties
    public int Id { get; }
    public string Name { get; }
    public string Unit { get; }
    public long DefaultAmountBeforeVatPerUnit { get; }
    public int DefaultVatPercentagePerUnit { get; }
    public bool IsDeleted { get; }
    #endregion
}
