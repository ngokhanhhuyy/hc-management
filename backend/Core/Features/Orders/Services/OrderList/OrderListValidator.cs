using FluentValidation;
using HCManagement.Core.Common.Localization;
using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.Orders;

internal class OrderListValidator : PaginatedListValidator<OrderListRequestDto, OrderListRequestDto.SortingCriterion>
{
    #region Constructors
    public OrderListValidator() : base(pageMinValue: 1, resultsPerPageMinValue: 5, resultsPerPageMaxValue: 50)
    {
        RuleFor(dto => dto.SearchContent)
            .MinimumLength(2)
            .MaximumLength(255)
            .WithName(DisplayNames.SearchContent);
    }
    #endregion
}
