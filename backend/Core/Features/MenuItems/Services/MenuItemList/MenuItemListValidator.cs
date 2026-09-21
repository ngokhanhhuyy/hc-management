using FluentValidation;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.MenuItems;

internal class MenuItemListValidator : ListValidator<MenuItemListRequestDto, MenuItemListRequestDto.SortingCriterion>
{
    #region Properties
    public MenuItemListValidator()
    {
        RuleFor(dto => dto.SearchContent)
            .MaximumLength(255)
            .WithName(DisplayNames.SearchContent);
    }
    #endregion
}
