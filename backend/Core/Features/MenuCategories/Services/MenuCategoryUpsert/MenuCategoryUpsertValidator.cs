using FluentValidation;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.MenuCategories;

internal class MenuCategoryUpsertValidator : Validator<MenuCategoryUpsertRequestDto>
{
    #region Constructors
    public MenuCategoryUpsertValidator()
    {
        RuleFor(dto => dto.Name)
            .NotEmpty()
            .MinimumLength(MenuCategoryContracts.NameMinLength)
            .MaximumLength(MenuCategoryContracts.NameMaxLength)
            .WithName(DisplayNames.Category);

        RuleFor(dto => dto.Index)
            .GreaterThan(0)
            .WithName(DisplayNames.Index);
    }
    #endregion
}
