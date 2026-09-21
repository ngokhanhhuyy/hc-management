using FluentValidation;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.Orders;

internal class OrderUpsertValidator : Validator<OrderUpsertRequestDto>
{
    #region Constructors
    public OrderUpsertValidator()
    {
        RuleFor(dto => dto.SeatingId)
            .NotEmpty()
            .WithName(DisplayNames.Seating);
            
        RuleFor(dto => dto.Items)
            .Must(items => items.Count > 0)
            .WithMessage(ErrorMessages.MinimumLength)
            .Must((dto, _) => dto.Items.Count == dto.Items.DistinctBy(i => i.MenuItemId).Count())
            .WithName(DisplayNames.OrderItem);
    }
    #endregion
}
