using HCManagement.Core.Common.Dtos;
using HCManagement.Core.Common.Extensions;

namespace HCManagement.Core.Features.Orders;

public class OrderListRequestDto : IPaginatedListRequestDto<OrderListRequestDto.SortingCriterion>
{
    #region Properties
    public bool SortByAscending { get; set; } = true;
    public SortingCriterion SortByCriterion { get; set; } = SortingCriterion.CreatedDateTime;
    public int Page { get; set; }
    public int ResultsPerPage { get; set; }
    public string? SearchContent { get; set; }
    #endregion

    #region Methods
    public void TransformValues()
    {
        SearchContent = SearchContent.ToNullIfEmptyOrWhiteSpace();
    }
    #endregion

    #region Enums
    public enum SortingCriterion
    {
        CreatedDateTime,
        LastUpdatedDateTime,
        FinishedDateTime,
        ItemAmount
    }
    #endregion
}
