using HCManagement.Core.Common.Validation;

namespace HCManagement.Core.Features.Orders;

internal class OrderListValidator : PaginatedListValidator<OrderListRequestDto, OrderListSortingCriterion>
{
    #region Constructors
    public OrderListValidator() : base(pageMinValue: 1, resultsPerPageMinValue: 5, resultsPerPageMaxValue: 50) { }
    #endregion
}
