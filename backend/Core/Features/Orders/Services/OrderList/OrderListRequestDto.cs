using HCManagement.Core.Common.Dtos;

namespace HCManagement.Core.Features.Orders;

public class OrderListRequestDto : IPaginatedListRequestDto<OrderListSortingCriterion>
{
    #region Properties
    public bool SortByAscending { get; set; } = true;
    public OrderListSortingCriterion SortByCriterion { get; set; } = OrderListSortingCriterion.CreatedDateTime;
    public int Page { get; set; } = 1;
    public int ResultsPerPage { get; set; } = 15;
    public bool DeletedIncluded { get; set; }
    #endregion

    #region Methods
    public void TransformValues() { }
    #endregion
}
