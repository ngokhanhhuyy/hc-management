using FluentValidation;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.MenuItems;

internal class MenuItemUpsertValidator : Validator<MenuItemUpsertRequestDto>
{
    #region Constructors
    public MenuItemUpsertValidator()
    {
        RuleFor(dto => dto.Name)
            .NotEmpty()
            .Length(MenuItemContracts.NameMinLength, MenuItemContracts.NameMaxLength)
            .IsValidName()
            .WithName(DisplayNames.Name);
        RuleFor(dto => dto.Unit)
            .NotEmpty()
            .MaximumLength(MenuItemContracts.UnitMaxLength)
            .WithName(DisplayNames.Unit);
        RuleFor(dto => dto.DefaultAmountBeforeVatPerUnit)
            .GreaterThanOrEqualTo(0)
            .WithName(DisplayNames.DefaultAmountBeforeVatPerUnit);
        RuleFor(dto => dto.DefaultVatPercentagePerUnit)
            .GreaterThanOrEqualTo(0)
            .LessThanOrEqualTo(100)
            .WithName(DisplayNames.DefaultVatPercentagePerUnit);
    }
    #endregion
}
