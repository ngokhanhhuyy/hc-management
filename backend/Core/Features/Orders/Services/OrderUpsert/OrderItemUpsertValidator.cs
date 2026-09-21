using FluentValidation;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.Orders;

internal class OrderItemUpsertValidator : Validator<OrderItemUpsertRequestDto>
{
    #region Constructors
    public OrderItemUpsertValidator()
    {
        RuleFor(dto => dto.AmountBeforeVatPerUnit)
            .GreaterThanOrEqualTo(0)
            .WithName(DisplayNames.AmountBeforeVatPerUnit);

        RuleFor(dto => dto.VatPercentagePerUnit)
            .GreaterThanOrEqualTo(0)
            .LessThanOrEqualTo(100)
            .WithName(DisplayNames.VatPercentagePerUnit);
        
        RuleFor(dto => dto.Quantity)
            .GreaterThanOrEqualTo(1)
            .LessThanOrEqualTo(999)
            .WithName(DisplayNames.Quantity);

        RuleFor(dto => dto.MenuItemId)
            .NotEmpty()
            .WithName(DisplayNames.MenuItem);
    }
    #endregion
}
